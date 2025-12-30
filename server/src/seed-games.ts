import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GamesService } from './games/games.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const gamesService = app.get(GamesService);

    const games = [
        {
            title: "Elden Ring",
            categories: ["Action", "RPG", "Adventure"],
            description: "มหากาพย์เกม Action RPG แฟนตาซี จากผู้สร้าง Dark Souls และ George R.R. Martin",
            price: 1990.00,
            stockQuantity: 50,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_Art.jpg"
        },
        {
            title: "Hogwarts Legacy",
            categories: ["Adventure", "RPG", "Action"],
            description: "สัมผัสชีวิตนักเรียนในโลกเวทมนตร์ฮอกวอตส์ช่วงยุค 1800",
            price: 1890.00,
            stockQuantity: 30,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/7c/Hogwarts_Legacy_cover.jpg"
        },
        {
            title: "The Legend of Zelda: Tears of the Kingdom",
            categories: ["Adventure", "Action", "Puzzle", "RPG"],
            description: "การผจญภัยครั้งใหม่ของ Link ในอาณาจักร Hyrule ทั้งบนดินและท้องฟ้า",
            price: 1750.00,
            stockQuantity: 25,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg"
        },
        {
            title: "Resident Evil 4 Remake",
            categories: ["Horror", "Action", "Shooter", "Adventure"],
            description: "การเอาชีวิตรอดจากหมู่บ้านสุดสยองและการช่วยเหลือลูกสาวประธานาธิบดี",
            price: 1690.00,
            stockQuantity: 40,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/df/Resident_Evil_4_remake_cover_art.jpg"
        },
        {
            title: "Cyberpunk 2077",
            categories: ["Action", "RPG", "Shooter", "Adventure"],
            description: "ผจญภัยในเมืองแห่งอนาคต Night City ที่เต็มไปด้วยเทคโนโลยีและอันตราย",
            price: 1450.00,
            stockQuantity: 15,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg"
        },
        {
            title: "Stardew Valley",
            categories: ["Simulation", "RPG", "Strategy"],
            description: "เกมปลูกผักทำฟาร์มสุดผ่อนคลาย สร้างชีวิตใหม่ในชนบท",
            price: 315.00,
            stockQuantity: 100,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/fd/Stardew_Valley.jpg"
        },
        {
            title: "Monster Hunter Rise",
            categories: ["Action", "RPG", "Adventure"],
            description: "ออกล่ามอนสเตอร์ยักษ์สุดท้าทายในสไตล์ญี่ปุ่นโบราณ",
            price: 1290.00,
            stockQuantity: 20,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/2/23/Monster_Hunter_Rise_Box_Art.png"
        },
        {
            title: "God of War Ragnarök",
            categories: ["Action", "Adventure", "Puzzle"],
            description: "บทสรุปตำนานเทพนอร์สของเครโทสและอเทรุส",
            price: 2290.00,
            stockQuantity: 35,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg"
        },
        {
            title: "Final Fantasy VII Rebirth",
            categories: ["RPG", "Action", "Adventure"],
            description: "การสานต่อตำนานการเดินทางของ Cloud และเพื่อนๆ สู่โลกกว้าง",
            price: 2390.00,
            stockQuantity: 10,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f3/Final_Fantasy_VII_Rebirth_cover.jpg"
        },
        {
            title: "It Takes Two",
            categories: ["Platformer", "Puzzle", "Adventure", "Action"],
            description: "เกมผจญภัยที่ต้องเล่นร่วมกันสองคนเพื่อแก้ไขปริศนาและฝ่าฟันอุปสรรค",
            price: 990.00,
            stockQuantity: 60,
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/aa/It_Takes_Two_cover_art.png"
        }
    ];

    console.log('Seeding games...');
    for (const game of games) {
        try {
            await gamesService.create(game);
            console.log(`✅ Created game: ${game.title}`);
        } catch (e) {
            console.error(`❌ Failed to create game ${game.title}:`, e.message);
        }
    }

    console.log('Seeding complete!');
    await app.close();
}

bootstrap();
