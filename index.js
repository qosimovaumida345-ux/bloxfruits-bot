const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// ==========================================
// 1. WEB SERVER (Render.com da bot uxlab qolmasligi uchun)
// ==========================================
const app = express();
app.get('/', (req, res) => {
  res.send('Blox Fruits Bot 24/7 ishlamoqda!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi.`);
});

// ==========================================
// 2. BOT SOZLAMALARI VA TOKENLAR
// ==========================================
const token = '8689663085:AAEtRKVPpqOMgjhV1L0rdMDArSSkUpnrafU'; // Sizning bot tokeningiz
const adminId = '8572227182'; // Sizning ID raqamingiz
const bot = new TelegramBot(token, { polling: true });

// Mijozlarning holatini saqlash uchun obyekt (Account sotish uchun)
let userStates = {};

// ==========================================
// 3. MENYULAR (Tugmalar)
// ==========================================
const mainMenu = {
    reply_markup: {
        keyboard: [
            ['🛒 Mevalar (Saytga O\'tish)', '🚀 Account Boost'],
            ['🤝 Account Oldi-Sotdi', '🌐 Saytimiz (GG Style)'],
            ['📞 Adminga Yozish']
        ],
        resize_keyboard: true
    }
};

const accountMenu = {
    reply_markup: {
        keyboard: [
            ['🛍 Tayyor Accountlar', '📹 Account Sotish'],
            ['⬅️ Asosiy Menyuga Qaytish']
        ],
        resize_keyboard: true
    }
};

const cancelMenu = {
    reply_markup: {
        keyboard: [
            ['❌ Bekor Qilish']
        ],
        resize_keyboard: true
    }
};

// ==========================================
// 4. XABARLARNI QABUL QILISH ASOSIY FUNKSIYASI
// ==========================================
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';

    // A) BEKOR QILISH TUGMASI BOSILGANDA
    if (text === '❌ Bekor Qilish' || text === '⬅️ Asosiy Menyuga Qaytish' || text === '/start') {
        delete userStates[chatId]; // Holatni tozalash
        bot.sendMessage(chatId, "👋 *Blox Fruits Premium Do'koniga Xush Kelibsiz!*\n\nQuyidagi menyudan o'zingizga kerakli bo'limni tanlang:", {
            parse_mode: "Markdown",
            ...mainMenu
        });
        return;
    }

    // B) AGAR MIJOZ "ACCOUNT SOTISH" JARAYONIDA BO'LSA
    if (userStates[chatId]) {
        // 1-bosqich: Ma'lumot qabul qilish
        if (userStates[chatId].step === 'WAITING_FOR_ACC_DETAILS') {
            if (!text) {
                bot.sendMessage(chatId, "⚠️ Iltimos, faqat yozma matn yuboring.");
                return;
            }
            userStates[chatId].details = text; // Matnni saqlaymiz
            userStates[chatId].step = 'WAITING_FOR_ACC_MEDIA'; // Keyingi qadamga o'tkazamiz
            
            bot.sendMessage(chatId, "✅ Ma'lumot qabul qilindi!\n\n📹 *Endi accountning to'liq obzor qilingan videosini (yoki rasmlarini) tashlang.*", {
                parse_mode: "Markdown",
                ...cancelMenu
            });
            return;
        }

        // 2-bosqich: Video yoki Rasm qabul qilish
        if (userStates[chatId].step === 'WAITING_FOR_ACC_MEDIA') {
            if (msg.video || msg.photo) {
                bot.sendMessage(chatId, "⏳ Ma'lumotlar adminga yuborilmoqda, kuting...");

                const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
                const captionText = `🚨 *YANGI ACCOUNT SOTUVGA KELDI!*\n\n👤 *Egasi:* ${username}\n\n📝 *Ma'lumot:* \n${userStates[chatId].details}`;

                try {
                    if (msg.video) {
                        await bot.sendVideo(adminId, msg.video.file_id, { caption: captionText, parse_mode: "Markdown" });
                    } else if (msg.photo) {
                        const fileId = msg.photo[msg.photo.length - 1].file_id; // Eng sifatli rasm
                        await bot.sendPhoto(adminId, fileId, { caption: captionText, parse_mode: "Markdown" });
                    }

                    bot.sendMessage(chatId, "✅ Account ma'lumotlari muvaffaqiyatli qabul qilindi va Adminga yuborildi! Tez orada siz bilan bog'lanishadi.", mainMenu);
                    delete userStates[chatId]; // Jarayon tugadi

                } catch (error) {
                    console.error("Adminga yuborishda xato:", error);
                    bot.sendMessage(chatId, "⚠️ Xatolik yuz berdi. Iltimos, adminga to'g'ridan-to'g'ri yozing.", mainMenu);
                    delete userStates[chatId];
                }
            } else {
                bot.sendMessage(chatId, "⚠️ Iltimos, accountni tasdiqlash uchun faqat *Video* yoki *Rasm* tashlang.", {parse_mode: "Markdown"});
            }
            return;
        }
    }

    // C) ASOSIY MENYU TUGMALARI ISHLASHI
    if (text === '🤝 Account Oldi-Sotdi') {
        bot.sendMessage(chatId, "🛍 O'zingizga kerakli bo'limni tanlang:", accountMenu);
    } 
    else if (text === '📹 Account Sotish') {
        userStates[chatId] = { step: 'WAITING_FOR_ACC_DETAILS' }; // Jarayonni boshlash
        bot.sendMessage(chatId, "📝 *Accountingiz haqida to'liq ma'lumot yozing:*\n\n- Level qanaqa?\n- Qanday mevalar yeyilgan?\n- Qanday qilich/itemlar bor?\n- Qancha narxga sotmoqchisiz?\n\n_Bitta xabarga hammasini sig'dirib yozing._", {
            parse_mode: "Markdown",
            ...cancelMenu
        });
    }
    else if (text === '🛒 Mevalar (Saytga O\'tish)' || text === '🌐 Saytimiz (GG Style)' || text === '🛍 Tayyor Accountlar' || text === '🚀 Account Boost') {
        // DIQQAT: Pastdagi linkni Netlify'dan olgan O'ZINGIZNING saytingiz linkiga almashtiring!
        const siteLink = "https://avgclub-bloxfruits.netlify.app"; 
        
        bot.sendMessage(chatId, `🔥 Barcha mevalar, boost xizmatlari va tayyor accountlarni bizning rasmiy saytimizdan xarid qilishingiz mumkin!\n\n🌐 *Saytga kirish:* ${siteLink}`, {
            parse_mode: "Markdown"
        });
    }
    else if (text === '📞 Adminga Yozish') {
        bot.sendMessage(chatId, "👨‍💻 Admin bilan bog'lanish uchun quyidagi manzilga yozing:\n\n👉 @BloxFruitsShopBy_AvgClub");
    }
});
