const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot ishladi!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server ${PORT}-portda ishga tushdi.`);
});

// Pastdan boshlab o'zingizning bot kodingiz davom etaveradi...
// const TelegramBot = require('node-telegram-bot-api');
// ... (qolgan hamma kod joyida qoladi)
const TelegramBot = require('node-telegram-bot-api');

const token = '8689663085:AAEtRKVPpqOMgjhV1L0rdMDArSSkUpnrafU';
const bot = new TelegramBot(token, { polling: true });

const ADMIN_ID = 8572227182; 
const CHANNEL_ID = '-1003830831325'; 
const CARD_NUMBER = '5614 6846 0556 8557';
const YOUTUBE_LINK = 'https://www.youtube.com/channel/UCcfXb4Tvl_vrNk9P-bIaNkg';
const TELEGRAM_LINK = 'https://t.me/+r3WVF-q52vplN2My';

const userState = {};

// Asosiy klaviatura - Barchasi katta harfda
const mainKeyboard = {
    reply_markup: {
        keyboard: [
            ['Permanent Fruit Sotib Olish', 'Physical Fruit Sotib Olish'],
            ['Account Boost', 'Admin Bilan Bog\'lanish'],
            ['Account Sotib Olish', 'Account Sotib Berish'],
            ['Commentlar', 'News']
        ],
        resize_keyboard: true
    }
};

const backKeyboard = {
    reply_markup: {
        keyboard: [['Orqaga']],
        resize_keyboard: true
    }
};

const fruitsList = {
    'Common': ['Rocket', 'Spin', 'Chop', 'Spring', 'Bomb', 'Smoke', 'Spike'],
    'Uncommon': ['Flame', 'Falcon', 'Ice', 'Sand', 'Dark', 'Diamond'],
    'Rare': ['Light', 'Rubber', 'Barrier', 'Ghost', 'Magma'],
    'Legendary': ['Quake', 'Buddha', 'Love', 'Spider', 'Sound', 'Phoenix', 'Portal', 'Rumble', 'Pain', 'Blizzard'],
    'Mythical': ['Gravity', 'Mammoth', 'T-Rex', 'Dough', 'Shadow', 'Venom', 'Control', 'Spirit', 'Kitsune', 'Tiger', 'Dragon (West)', 'Dragon (East)']
};

const fruitPrices = {
    'Rocket': { physical: 1000, perm: 10000, value: '5,000' },
    'Spin': { physical: 1000, perm: 10000, value: '7,500' },
    'Chop': { physical: 1500, perm: 15000, value: '30,000' },
    'Spring': { physical: 1500, perm: 15000, value: '60,000' },
    'Bomb': { physical: 1500, perm: 15000, value: '80,000' },
    'Smoke': { physical: 2000, perm: 20000, value: '100,000' },
    'Spike': { physical: 2000, perm: 20000, value: '180,000' },
    'Flame': { physical: 3000, perm: 30000, value: '250,000' },
    'Falcon': { physical: 3000, perm: 30000, value: '300,000' },
    'Ice': { physical: 3500, perm: 35000, value: '350,000' },
    'Sand': { physical: 3500, perm: 35000, value: '420,000' },
    'Dark': { physical: 3500, perm: 35000, value: '500,000' },
    'Diamond': { physical: 4000, perm: 40000, value: '600,000' },
    'Light': { physical: 5000, perm: 50000, value: '650,000' },
    'Rubber': { physical: 5000, perm: 50000, value: '750,000' },
    'Barrier': { physical: 5000, perm: 50000, value: '800,000' },
    'Ghost': { physical: 5500, perm: 55000, value: '940,000' },
    'Magma': { physical: 6000, perm: 60000, value: '850,000' },
    'Quake': { physical: 8000, perm: 80000, value: '1,000,000' },
    'Buddha': { physical: 10000, perm: 100000, value: '1,200,000' },
    'Love': { physical: 8000, perm: 80000, value: '1,300,000' },
    'Spider': { physical: 8000, perm: 80000, value: '1,500,000' },
    'Sound': { physical: 9000, perm: 90000, value: '1,700,000' },
    'Phoenix': { physical: 9000, perm: 90000, value: '1,800,000' },
    'Portal': { physical: 12000, perm: 120000, value: '1,900,000' },
    'Rumble': { physical: 10000, perm: 100000, value: '2,100,000' },
    'Pain': { physical: 8000, perm: 80000, value: '2,300,000' },
    'Blizzard': { physical: 10000, perm: 100000, value: '2,400,000' },
    'Gravity': { physical: 15000, perm: 150000, value: '2,500,000' },
    'Mammoth': { physical: 18000, perm: 180000, value: '2,700,000' },
    'T-Rex': { physical: 20000, perm: 200000, value: '3,000,000' },
    'Dough': { physical: 25000, perm: 250000, value: '2,800,000' },
    'Shadow': { physical: 18000, perm: 180000, value: '2,900,000' },
    'Venom': { physical: 20000, perm: 200000, value: '3,000,000' },
    'Control': { physical: 18000, perm: 180000, value: '3,200,000' },
    'Spirit': { physical: 20000, perm: 200000, value: '3,400,000' },
    'Kitsune': { physical: 40000, perm: 350000, value: '8,000,000' },
    'Tiger': { physical: 30000, perm: 400000, value: '10,000,000' },
    'Dragon (West)': { physical: 100000, perm: 700000, value: '15,000,000' },
    'Dragon (East)': { physical: 100000, perm: 700000, value: '15,000,000' }
};

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Asosiy menyuga xush kelibsiz! O'zingizga kerakli bo'limni tanlang:", mainKeyboard);
    userState[msg.chat.id] = { step: 'MAIN' };
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const state = userState[chatId] || { step: 'MAIN' };

    if (text === 'Orqaga') {
        userState[chatId] = { step: 'MAIN' };
        return bot.sendMessage(chatId, "Asosiy menyuga qaytdingiz.", mainKeyboard);
    }

    if (text === 'Permanent Fruit Sotib Olish' || text === 'Physical Fruit Sotib Olish') {
        const isPerm = text.includes('Permanent');
        userState[chatId] = { step: 'RARITY_SELECT', type: isPerm ? 'perm' : 'physical' };
        
        const rarityButtons = Object.keys(fruitsList).map(rarity => [{ text: rarity, callback_data: `rarity_${rarity}` }]);
        bot.sendMessage(chatId, "Qanday turdagi mevani qidiryapsiz?", {
            reply_markup: { inline_keyboard: rarityButtons }
        });
        bot.sendMessage(chatId, "Menyuga qaytish uchun:", backKeyboard);
    }

    else if (text === 'Account Boost') {
        userState[chatId] = { step: 'BOOST_MENU' };
        const boostButtons = [
            [{ text: 'Raidga Yordam Berish', callback_data: 'boost_raid' }],
            [{ text: 'Race Olishga Yordam Berish', callback_data: 'boost_race' }],
            [{ text: 'Gamepass Olib Berish', callback_data: 'boost_gamepass' }],
            [{ text: 'Account Level Kuchaytirib Berish', callback_data: 'boost_level' }],
            [{ text: 'Fighting Style Olib Berish', callback_data: 'boost_style' }]
        ];
        bot.sendMessage(chatId, "Qanday xizmat kerak?", { reply_markup: { inline_keyboard: boostButtons } });
        bot.sendMessage(chatId, "Orqaga qaytish uchun:", backKeyboard);
    }

    else if (text === 'Admin Bilan Bog\'lanish') {
        bot.sendMessage(chatId, "Admin bilan bog'lanish: @BloxFruitsShopBy_AvgClub");
    }

    else if (text === 'Commentlar' || text === 'News') {
        bot.sendMessage(chatId, `Telegram kanalimiz: ${TELEGRAM_LINK}\nYouTube kanalimiz: ${YOUTUBE_LINK}`);
    }

    else if (text === 'Account Sotib Berish') {
        userState[chatId] = { step: 'SELL_ACC_VIDEO' };
        bot.sendMessage(chatId, "Accountni sotish uchun 3-5 minutlik video, xohlagan narxingizni hamda Roblox Username va Parolni yozib yuboring.", backKeyboard);
    }

    else if (text === 'Account Sotib Olish') {
        bot.sendMessage(chatId, "Hozircha bazada tasdiqlangan accountlar yo'q. Yangiliklar uchun kanalni kuzating yoki adminga yozing.", mainKeyboard);
    }

    // Skrinshot qabul qilish (Xarid uchun ticket)
    else if ((msg.photo || msg.document) && state.step === 'AWAITING_PAYMENT') {
        const item = state.itemDetails;
        
        // Rasm fayl bo'lib keldimi yoki oddiy rasm bo'lib keldimi tekshiramiz (eng tiniq versiyasini olamiz)
        const fileId = msg.photo ? msg.photo[msg.photo.length - 1].file_id : msg.document.file_id;
        
        bot.sendMessage(chatId, "✅ Skrinshot va to'lov qabul qilindi! Ticket ochildi va adminga yuborildi. Iltimos, kuting...", mainKeyboard);
        
        if (msg.photo) {
             bot.sendPhoto(ADMIN_ID, fileId, {
                 caption: `🎫 YANGI TICKET!\nSotib oluvchi: @${msg.from.username || msg.from.first_name}\nNima olyapti: ${item}\n\nTo'lov tekshiring va user bilan bog'laning.`
             });
        } else {
             bot.sendDocument(ADMIN_ID, fileId, {
                 caption: `🎫 YANGI TICKET!\nSotib oluvchi: @${msg.from.username || msg.from.first_name}\nNima olyapti: ${item}\n\nHujjat/Fayl shaklidagi to'lov cheki.`
             });
        }
        userState[chatId] = { step: 'MAIN' };
    }

    // Video va Account ma'lumotlarini qabul qilish
    else if ((msg.video || msg.document) && state.step === 'SELL_ACC_VIDEO') {
        bot.sendMessage(chatId, "✅ Account ma'lumotlari adminga yuborildi. Tekshirilgach kanalga joylanadi.", mainKeyboard);
        bot.forwardMessage(ADMIN_ID, chatId, msg.message_id);
        bot.sendMessage(ADMIN_ID, `Yangi Account Sotuvchisi: @${msg.from.username || msg.from.first_name}. Video ustida narx va login/parol yozilgan bo'lishi mumkin. Tekshirib kanalga joylang.`);
        userState[chatId] = { step: 'MAIN' };
    }
}); // <--- MANA SHU QAVS YOPILMAY QOLGAN EDI, QO'SHILDI

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const state = userState[chatId];

    if (data.startsWith('rarity_')) {
        const rarity = data.split('_')[1];
        const fruits = fruitsList[rarity];
        
        const fruitButtons = [];
        for (let i = 0; i < fruits.length; i += 2) {
            const row = [{ text: fruits[i], callback_data: `fruit_${fruits[i]}` }];
            if (fruits[i+1]) row.push({ text: fruits[i+1], callback_data: `fruit_${fruits[i+1]}` });
            fruitButtons.push(row);
        }
        
        bot.sendMessage(chatId, `${rarity} mevalar:`, { reply_markup: { inline_keyboard: fruitButtons } });
    }

    else if (data.startsWith('fruit_')) {
        const fruitName = data.replace('fruit_', '');
        const fruitData = fruitPrices[fruitName];
        const type = state.type; 
        const price = type === 'perm' ? fruitData.perm : fruitData.physical;
        const value = fruitData.value;
        
        userState[chatId].selectedItem = `${type.toUpperCase()} ${fruitName}`;
        userState[chatId].price = price;

        bot.sendMessage(chatId, `🍎 Meva: ${fruitName}\n⚙️ Turi: ${type === 'perm' ? 'Permanent' : 'Physical'}\n💎 O'yindagi Value: ${value}\n\n💵 Narxi: ${price} so'm\n\nSotib Olasizmi?`, {
            reply_markup: {
                inline_keyboard: [[{ text: 'Ha', callback_data: 'buy_yes' }, { text: 'Yo\'q', callback_data: 'buy_no' }]]
            }
        });
    }

    else if (data.startsWith('boost_')) {
        const boostMap = {
            'boost_raid': 'Raidga Yordam', 'boost_race': 'Race Olish', 'boost_gamepass': 'Gamepass', 
            'boost_level': 'Level Ko\'tarish', 'boost_style': 'Fighting Style'
        };
        const item = boostMap[data];
        userState[chatId] = { step: 'AWAITING_PAYMENT', itemDetails: `Boost Xizmati: ${item}` };
        bot.sendMessage(chatId, `Siz ${item} tanladingiz.\n\nTo'lov uchun karta:\n💳 ${CARD_NUMBER}\n\nTo'lov qilgach, chek (skrinshot) va Roblox Username'ni bitta xabarda rasm qilib shu botga yuboring.`);
    }

    else if (data === 'buy_yes') {
        const item = state.selectedItem;
        userState[chatId] = { step: 'AWAITING_PAYMENT', itemDetails: item };
        bot.sendMessage(chatId, `Ajoyib! Ushbu kartaga ${state.price} so'm o'tkazing:\n\n💳 ${CARD_NUMBER}\n\nTo'lov qilgach, chek (skrinshot) va Roblox Username'ni rasmga qo'shib botga yuboring.`);
    }

    else if (data === 'buy_no') {
        bot.sendMessage(chatId, "Xarid bekor qilindi.", mainKeyboard);
        userState[chatId] = { step: 'MAIN' };
    }

    bot.answerCallbackQuery(query.id);
});

console.log("Blox Fruits Bot - Muvaffaqiyatli ishga tushdi!");