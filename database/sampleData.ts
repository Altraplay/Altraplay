import db from './orm'

const users = [
	{
		id: 'batman',
		username: '@batman',
		name: 'Bruce Wayne',
		password: 'password123',
		email: 'batman@justiceleague.com',
		bio: 'I am Vengeance, I am the Night, I am Batman',
		profile_picture: 'https://i.pinimg.com/736x/ae/a7/a9/aea7a9551cda1f88cc5e6e7ea52709f1.jpg',
		banner: 'https://static.dc.com/2023-06/press_062123_arkham_featured_wide.jpg',
		followers: ['superman', 'wonderwoman'],
		following: ['robin', 'nightwing'],
		interests: ['detective', 'martial arts'],
		points: 10000,
		level: 'The Cosmic Lion',
		needs_for_next_level: 12000,
		roles: ['Super Admin', 'Moderator'],
		skills: [
			{ name: 'Martial Arts', level: 100 },
			{ name: 'Investigation', level: 100 }
		],
		languages: [{ name: 'English', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '123456',
		collect_history: true,
		visibility: ['public'],
		earning: 1000000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'goku',
		username: '@goku',
		name: 'Son Goku',
		password: 'password123',
		email: 'goku@dragonball.com',
		bio: 'Saiyan Warrior',
		profile_picture: 'https://i.pinimg.com/736x/9f/cd/db/9fcddb3f3fa5af6739709d61b197d114.jpg',
		banner:
			'https://imgcdn.stablediffusionweb.com/2024/4/7/8d358416-5224-462d-a240-51e62e66fe2d.jpg',
		followers: ['vegeta', 'krillin'],
		following: ['bulma', 'trunks'],
		interests: ['fighting', 'training'],
		points: 15000,
		level: 'King of Content',
		needs_for_next_level: 3000,
		roles: ['User', 'Premium User'],
		skills: [
			{ name: 'Martial Arts', level: 100 },
			{ name: 'Super Saiyan', level: 100 }
		],
		languages: [{ name: 'Japanese', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '654321',
		collect_history: true,
		visibility: ['public'],
		earning: 2000000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'kakashi',
		username: '@kakashi',
		name: 'Kakashi',
		password: 'password123',
		email: 'kakashi@naruto.com',
		bio: 'Copy Ninja',
		profile_picture: 'https://i.pinimg.com/736x/65/0e/83/650e83b9b6c8eba71f416ee362fb1689.jpg',
		banner:
			'https://fiverr-res.cloudinary.com/t_main1,q_auto,f_auto/gigs2/231221690/original/fb7ac9454943962800e14cf39daa384f86839352.png',
		followers: ['naruto', 'sasuke'],
		following: ['sakura', 'jiraiya'],
		interests: ['ninjutsu', 'teaching'],
		points: 8000,
		level: 'Neon Ninja',
		needs_for_next_level: 1500,
		roles: ['User', 'Diamond User'],
		skills: [
			{ name: 'Ninjutsu', level: 9 },
			{ name: 'Genjutsu', level: 8 }
		],
		languages: [{ name: 'Japanese', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '789123',
		collect_history: true,
		visibility: ['public'],
		earning: 750000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'ash',
		username: '@ash',
		name: 'Ash Ketchum',
		password: 'password123',
		email: 'ash@pokemon.com',
		bio: 'On a journey/mission to become worlds best Pokemon Trainer!',
		profile_picture: 'https://i.pinimg.com/736x/18/8a/23/188a233e8ce1623d3ef1fb96b88f8a1e.jpg',
		banner: 'https://i.postimg.cc/vTBWW1Z2/pxfuel-4-transformed-1.jpg',
		links: ['https://instagram.com/techgunner', 'https://github.com/techgunners'],
		followers: ['misty', 'brock'],
		following: ['pikachu', 'gary'],
		interests: ['pokemon', 'battling'],
		points: 5000,
		level: 'Electric Knight',
		needs_for_next_level: 1200,
		roles: ['User', 'Premium User'],
		skills: [
			{ name: 'Pokemon Training', level: 85 },
			{ name: 'Battling', level: 90 }
		],
		languages: [{ name: 'English', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '456789',
		collect_history: true,
		visibility: ['public'],
		earning: 600000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'optimus_prime',
		username: '@optimus',
		name: 'Optimus Prime',
		password: 'password123',
		email: 'optimus@autobots.com',
		bio: 'Autobot Leader',
		profile_picture:
			'https://w0.peakpx.com/wallpaper/144/309/HD-wallpaper-autobot-logo-g1-transformers.jpg',
		banner:
			'https://news.tfw2005.com/wp-content/uploads/sites/10/2022/02/Transformers-Paramount-1278x250.jpeg',
		followers: ['bumblebee', 'ratchet'],
		following: ['megatron', 'starscream'],
		interests: ['leadership', 'strategy'],
		points: 20000,
		level: 'The Blazing Beacon',
		needs_for_next_level: 4000,
		roles: ['User', 'Admin'],
		skills: [
			{ name: 'Leadership', level: 100 },
			{ name: 'Combat', level: 100 }
		],
		languages: [{ name: 'Cybertronian', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '987654',
		collect_history: true,
		visibility: ['public'],
		earning: 3000000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'nightwing',
		username: '@nightwing',
		name: 'Grayson',
		password: 'password123',
		email: 'nightwing@justiceleague.com',
		bio: 'The original Robin, now a hero in his own right.',
		profile_picture: 'https://cdn.dribbble.com/users/20878/screenshots/1658780/nightwing-dribbble_1x.png',
		banner: 'https://wallpapers.com/images/hd/faceless-nightwing-in-violet-backdrop-sewzi37ar2kagb2x.jpg',
		followers: ['batman', 'robin'],
		following: ['batman', 'superman'],
		interests: ['acrobatics', 'martial arts'],
		points: 8000,
		level: 'Neon Ninja',
		needs_for_next_level: 10000,
		roles: ['User', 'Admin'],
		skills: [
			{ name: 'Acrobatics', level: 100 },
			{ name: 'Martial Arts', level: 9 }
		],
		languages: [{ name: 'English', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '321654',
		collect_history: true,
		visibility: ['public'],
		earning: 800000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'joker',
		username: '@joker',
		name: 'Joker',
		password: 'password123',
		email: 'joker@gotham.com',
		bio: 'Why so serious? 😈',
		profile_picture: 'https://c.wallhere.com/photos/c7/6b/Joker_Batman_Heath_Ledger-84483.jpg!d',
		banner: 'https://example.com/joker_banner.jpg',
		followers: ['harleyquinn', 'penguin'],
		following: ['harleyquinn', 'riddler'],
		interests: ['chaos', 'anarchy'],
		points: 5000,
		level: 'Silent Soul',
		needs_for_next_level: 8000,
		roles: ['User'],
		languages: [{ name: 'English', level: 100 }],
		verified: false,
		is_email_verified: true,
		otp: '456123',
		collect_history: true,
		visibility: ['public'],
		earning: 600000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'jason',
		username: '@jason',
		name: 'Jason',
		password: 'password123',
		email: 'jason@turningmecard.com',
		bio: 'Hero from the world of Turning Mecard',
		profile_picture: 'https://example.com/jason_profile.jpg',
		banner: 'https://example.com/jason_banner.jpg',
		followers: ['ally', 'evan'],
		following: ['ally', 'ryan'],
		interests: ['mech battles', 'adventure'],
		points: 7000,
		level: 'Electric Knight',
		needs_for_next_level: 9000,
		roles: ['User', 'Premium User'],
		skills: [
			{ name: 'Mech Control', level: 9 },
			{ name: 'Strategy', level: 8 }
		],
		languages: [{ name: 'English', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '654789',
		collect_history: true,
		visibility: ['public'],
		earning: 500000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'green_lantern',
		username: '@greenlantern',
		name: 'Hal Jordan',
		password: 'password123',
		email: 'hal@justiceleague.com',
		bio: "In brightest day, in blackest night, no evil shall escape my sight. Let those who worship evil's might beware my power Green Lantern's light!",
		profile_picture: 'https://example.com/greenlantern_profile.jpg',
		banner: 'https://example.com/greenlantern_banner.jpg',
		followers: ['batman', 'superman'],
		following: ['wonderwoman', 'flash'],
		interests: ['space patrol', 'justice'],
		points: 10000,
		level: 'The Blazing Beacon',
		needs_for_next_level: 13000,
		roles: ['User', 'Admin'],
		skills: [
			{ name: 'Ring Mastery', level: 100 },
			{ name: 'Aviation', level: 9 }
		],
		languages: [{ name: 'English', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '987321',
		collect_history: true,
		visibility: ['public'],
		earning: 1000000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'ironman',
		username: '@ironman',
		name: 'Tony Stark',
		password: 'password123',
		email: 'ironman@avengers.com',
		bio: 'Genius, Billionaire, Playboy, Philanthropist',
		profile_picture: 'https://example.com/ironman_profile.jpg',
		banner: 'https://example.com/ironman_banner.jpg',
		followers: ['captainamerica', 'thor'],
		following: ['hulk', 'blackwidow'],
		interests: ['technology', 'innovation'],
		points: 12000,
		level: 'Technology Demon',
		needs_for_next_level: 15000,
		roles: ['User', 'Admin'],
		skills: [
			{ name: 'Engineering', level: 100 },
			{ name: 'Combat', level: 9 }
		],
		languages: [{ name: 'English', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '159357',
		collect_history: true,
		visibility: ['public'],
		earning: 2000000,
		joined_at: new Date(Date.now())
	},
	{
		id: 'saitama',
		username: '@saitama',
		name: 'Saitama',
		password: 'password123',
		email: 'saitama@onepunchman.com',
		bio: 'The hero for fun',
		profile_picture: 'https://example.com/saitama_profile.jpg',
		banner: 'https://example.com/saitama_banner.jpg',
		followers: ['genos', 'king'],
		following: ['genos', 'blizzard'],
		interests: ['heroism', 'training'],
		points: 15000,
		level: 'The Blazing Souls of Creators',
		needs_for_next_level: 17000,
		roles: ['User', 'Premium User'],
		skills: [
			{ name: 'Super Strength', level: 100 },
			{ name: 'Speed', level: 9 }
		],
		languages: [{ name: 'Japanese', level: 100 }],
		verified: true,
		is_email_verified: true,
		otp: '753951',
		collect_history: true,
		visibility: ['public'],
		earning: 800000,
		joined_at: new Date(Date.now())
	}
]

const blogs = [
	{
		id: 'blog1',
		title: 'The Legend of the Dark Knight',
		content: `
	 <section>
	   <p>Gotham City has always been a beacon for the lost and the desperate, a sprawling metropolis rife with crime and corruption. But within its shadowy depths rises a figure of unparalleled determination and justice: Batman, the Dark Knight. From the moment young Bruce Wayne witnessed the tragic death of his parents, his path was set. He would become more than just a man; he would become a symbol, a legend, and the protector Gotham so desperately needed.</p>
	 </section>
	 <section>
	   <p>Bruce Wayne's transformation into Batman was not an overnight occurrence. It was a relentless journey of training and self-discovery. Traveling the world, Bruce sought the best mentors in martial arts, criminology, and stealth. His time with the League of Shadows, where he learned the art of fear and deception, was pivotal. Yet, he rejected their lethal methods, vowing never to take a life.</p>
	   <p>Upon his return to Gotham, Bruce began crafting his alter ego. Inspired by the bats that once terrified him, he embraced the persona of Batman, using his fear as a weapon against those who prey on the innocent. The Batcave beneath Wayne Manor became his sanctuary, filled with state-of-the-art technology and weaponry, each designed to aid in his war on crime.</p>
	 </section>
	 <section>
	   <p>Batman's rogue gallery is one of the most infamous in comic history. Each villain, from the psychotic Joker to the cold and calculated Mr. Freeze, represents a different facet of Gotham's darkness. These confrontations are not merely physical but psychological battles, testing Batman's resolve and pushing him to his limits.</p>
	   <p>One of Batman's greatest challenges was the arrival of Bane, a mastermind with both brawn and brains. Their epic showdown, where Bane famously broke Batman's back, left the Dark Knight at his most vulnerable. But even in his darkest hour, Bruce's indomitable will and the support of his allies helped him rise once more, stronger than ever.</p>
	 </section>
	 <section>
	   <p>Allies like Alfred Pennyworth, his loyal butler and father figure, and Commissioner Gordon, a steadfast ally within the Gotham City Police Department, have been crucial in Batman's crusade. The introduction of sidekicks like Robin brought new dynamics to his mission. Each Robin - Dick Grayson, Jason Todd, Tim Drake, and Damian Wayne - added their own flair and skills, ensuring that Batman's legacy would endure.</p>
	   <p>Batman is not just a hero; he's an icon. His influence extends beyond Gotham, inspiring other heroes and striking fear into the hearts of criminals worldwide. His tactical genius and preparedness for any situation have made him a key member of the Justice League, often taking the lead in battles that threaten the entire planet.</p>
	 </section>
	 <section>
	   <p>The legend of the Dark Knight is not just about a man in a bat costume. It's about the enduring spirit of justice, the relentless fight against corruption, and the belief that one person can make a difference. Batman's journey from a traumatized boy to a symbol of hope and fear is a testament to the power of resilience and the impact of one individual's unwavering commitment to their ideals.</p>
	   <p>In the heart of Gotham, as the Bat-Signal shines brightly against the night sky, the citizens know that their protector is ever-vigilant. Batman's legacy is one of courage, justice, and an unyielding belief that no matter how dark the night, dawn is always just around the corner.</p>
	 </section>`,
		author: 'batman',
		cover:
			'https://e1.pxfuel.com/desktop-wallpaper/407/547/desktop-wallpaper-the-batman-movie-2022-pc-the-batman.jpg',
		likes: 9000,
		dislikes: 10,
		visibility: ['public'],
		slashtags: [
			'batman',
			'gotham',
			'justiceleague',
			'darkknight',
			'superhero',
			'vigilante',
			'comicbooks',
			'dccomics',
			'joker',
			'bane',
			'catwoman',
			'alfred',
			'robin',
			'batcave',
			'wayneenterprise',
			'brucewayne',
			'crimefighter',
			'detective',
			'capedcrusader',
			'leagueofshadows',
			'fear',
			'symbol',
			'legend',
			'night',
			'protector',
			'hope',
			'justice',
			'warrior',
			'hero'
		],
		views: 1258000,
		created_at: new Date(Date.now())
	},
	{
		id: 'blog2',
		title: "The Saiyan Saga: Goku's Journey",
		content: `
	 <section>
	   <p>The Saiyan Saga marks the beginning of one of the most intense periods in Goku's life. Sent to Earth as a child, Goku grew up unaware of his Saiyan heritage. His calm life changed dramatically when his brother Raditz appeared, revealing Goku's true origins. This saga is filled with fierce battles and dramatic transformations, showcasing Goku's incredible strength and determination. From his first encounter with Vegeta to the epic showdown with Nappa, each fight pushed Goku to new limits. With the help of his friends and the power of the Dragon Balls, Goku managed to overcome these formidable foes, solidifying his place as one of the greatest warriors in the universe.</p>
	 </section>
	 <section>
	   <p>Goku's journey began on the planet Vegeta, where he was born as Kakarot. As a Saiyan, he was sent to Earth with a mission to conquer it, but fate had other plans. Raised by Grandpa Gohan, Goku grew up to be a kind-hearted and pure soul, unaware of his true origins. His peaceful life in the mountains was shattered when Raditz arrived, revealing the truth about Goku's heritage and his mission.</p>
	   <p>This revelation set the stage for a series of battles that would define Goku's journey. The fight against Raditz was intense, with Goku teaming up with his former enemy Piccolo to defeat his brother. The victory came at a great cost, as Goku sacrificed his life to ensure Raditz's defeat. This selfless act showcased Goku's willingness to protect his loved ones at any cost.</p>
	   <p>Goku's time in the afterlife was spent training under King Kai, learning powerful techniques such as the Kaio-ken and the Spirit Bomb. These skills proved invaluable when he was resurrected to face the new threat posed by Vegeta and Nappa. The battle against these Saiyan warriors was one of the most challenging in Goku's life, pushing him to his limits.</p>
	 </section>
	 <section>
	   <p>The arrival of Vegeta marked a turning point in Goku's journey. As the prince of the Saiyans, Vegeta was a formidable opponent, with a power level that far exceeded anything Goku had faced before. Their battle was fierce and destructive, with both warriors pushing themselves to the brink. Despite the odds, Goku's determination and training allowed him to hold his own against Vegeta.</p>
	   <p>The fight against Vegeta was not just a physical battle but also a clash of ideologies. Vegeta's pride and desire for dominance contrasted with Goku's humility and desire to protect. Their battle ended in a stalemate, with Vegeta retreating and vowing to return stronger. This encounter laid the foundation for one of the most iconic rivalries in anime history.</p>
	   <p>In the aftermath of the battle, Goku's friends and allies played crucial roles in defending Earth. Characters like Krillin, Gohan, and Yamcha faced their own battles, showcasing their growth and determination. These moments highlighted the importance of teamwork and camaraderie in the face of overwhelming odds.</p>
	 </section>
	 <section>
	   <p>The Saiyan Saga also introduced the concept of the Dragon Balls, mystical orbs that could grant any wish when gathered together. These artifacts became a central element in Goku's journey, often serving as the catalyst for new adventures and challenges. The quest for the Dragon Balls brought Goku and his friends into contact with new allies and enemies, each contributing to the rich tapestry of the Dragon Ball universe.</p>
	   <p>One of the most memorable moments in the Saiyan Saga was Goku's transformation into a Super Saiyan. This legendary form, characterized by golden hair and a massive increase in power, became a symbol of Goku's Saiyan heritage and his potential for growth. The transformation was not just a physical change but a representation of Goku's inner strength and determination.</p>
	   <p>Goku's battles during the Saiyan Saga were not just about physical strength but also about strategic thinking and adaptability. He often found creative solutions to seemingly insurmountable problems, showcasing his ingenuity and quick thinking. These qualities made Goku a formidable warrior and a beloved character among fans.</p>
	 </section>
	 <section>
	   <p>As the Saiyan Saga progressed, Goku's relationships with his friends and family deepened. His bond with his son Gohan was particularly poignant, highlighting the importance of family and the passing of the torch to the next generation. Gohan's potential as a warrior was nurtured by Goku, setting the stage for future sagas and battles.</p>
	   <p>The conclusion of the Saiyan Saga saw Goku and his friends victorious, but it was clear that their journey was far from over. The battles they faced had prepared them for even greater challenges, both on Earth and beyond. Goku's unwavering spirit and desire to protect his loved ones would continue to drive him forward, no matter what obstacles lay ahead.</p>
	   <p>In the end, the Saiyan Saga is a testament to Goku's resilience and determination. It is a story of growth, both personal and collective, as Goku and his friends faced their fears and emerged stronger. The saga set the stage for the epic battles and adventures that would follow, cementing Goku's place as one of the greatest heroes in anime history.</p>
	 </section>`,
		author: 'goku',
		cover:
			'https://c4.wallpaperflare.com/wallpaper/823/1023/805/son-goku-anime-saiyan-dragon-ball-z-digital-art-hd-wallpaper-preview.jpg',
		likes: 86000,
		dislikes: 15,
		visibility: ['public'],
		slashtags: [
			'dragonball',
			'saiyan',
			'goku',
			'anime',
			'manga',
			'superSaiyan',
			'kamehameha',
			'zfighters',
			'dragonballs',
			'vegeta',
			'raditz',
			'kingkai',
			'piccolo',
			'nappa',
			'gohan',
			'krillin',
			'bulma',
			'yamcha',
			'tien',
			'chiatzu',
			'masterroshi',
			'kami',
			'shenron',
			'frieza',
			'powerlevels',
			'dbz',
			'dbsuper',
			'training',
			'fighting',
			'adventure'
		],
		views: 1624930,
		created_at: new Date(Date.now())
	},
	{
		id: 'blog3',
		title: "Kakashi's Journey: From Tragedy to Triumph",
		content: `
	 <section>
	   <p>Kakashi Hatake is a name that resonates with greatness and mystery within the ninja world. Known for his exceptional skills, calm demeanor, and tragic past, Kakashi's journey is one of overcoming immense personal loss and rising to the pinnacle of the ninja ranks. From his early days as a prodigious child to becoming the Sixth Hokage of Konoha, Kakashi's story is a testament to resilience and the indomitable spirit of a true ninja.</p>
	 </section>
	 <section>
	   <p>Kakashi's early life was marked by the loss of his father, Sakumo Hatake, a legendary ninja who took his own life after a mission failure. This event profoundly impacted young Kakashi, instilling in him a strict adherence to the ninja code and a reluctance to form close bonds. His prodigious talent saw him graduate from the ninja academy at a young age and join Team Minato, where he formed bonds that would shape his future.</p>
	   <p>One of the most significant moments in Kakashi's life was the mission where he lost his teammate, Obito Uchiha. Obito's apparent death left Kakashi with the gift of the Sharingan, a powerful eye technique that he would become famous for. This event also deeply influenced his outlook on life, teaching him the importance of teamwork and the value of his comrades.</p>
	   <p>Despite the hardships, Kakashi rose through the ranks, earning the nickname "Copy Ninja Kakashi" for his ability to replicate any jutsu he saw with his Sharingan. His prowess in battle and strategic mind made him a key asset to Konoha, and he often undertook high-risk missions that others would shy away from.</p>
	 </section>
	 <section>
	   <p>Kakashi's role as a mentor to Team 7, consisting of Naruto Uzumaki, Sasuke Uchiha, and Sakura Haruno, was another defining chapter in his life. Each member of Team 7 presented unique challenges, but Kakashi's guidance helped them grow into powerful ninjas. His teachings emphasized the importance of teamwork, resilience, and the willingness to sacrifice for the greater good.</p>
	   <p>During the Fourth Great Ninja War, Kakashi's leadership and strategic acumen were instrumental in the Allied Shinobi Forces' efforts against the formidable threats posed by Madara Uchiha and the Ten-Tails. His battles alongside his former mentor Minato and his teammates were a testament to his growth as a ninja and a leader.</p>
	   <p>One of the most poignant moments during the war was Kakashi's reunion with Obito, who had survived and become one of the war's main antagonists. Their confrontation was not just a physical battle but a clash of ideologies and redemption. Kakashi's resolve to save his friend, despite the odds, showcased his unwavering belief in the power of friendship and redemption.</p>
	 </section>
	 <section>
	   <p>In the aftermath of the war, Kakashi's journey came full circle as he was appointed the Sixth Hokage of Konoha. This role was a culmination of his experiences, trials, and growth. As Hokage, Kakashi continued to uphold the values of loyalty, duty, and perseverance that had defined his life. His tenure saw the rebuilding of Konoha and the strengthening of bonds between the village and its allies.</p>
	   <p>Throughout his journey, Kakashi's relationships with his comrades played a significant role in shaping his path. His bond with Guy, his eternal rival, was one of mutual respect and competition. Their rivalry pushed both to greater heights, often resulting in humorous yet profound moments. Kakashi's interactions with other key figures, such as Jiraiya and Tsunade, further enriched his journey, providing mentorship and support.</p>
	   <p>Kakashi's impact extended beyond his immediate circle. His teachings and leadership influenced a new generation of ninja, inspiring them to uphold the values of the ninja way. His legacy as the Copy Ninja and the Sixth Hokage is a testament to his enduring spirit and dedication to protecting Konoha.</p>
	 </section>
	 <section>
	   <p>In conclusion, Kakashi's path is one of resilience, growth, and unwavering commitment to the ideals of the ninja way. From his early losses to his triumphs as a mentor and leader, Kakashi's journey is a testament to the power of perseverance and the importance of bonds. As the Copy Ninja, he continues to inspire and captivate, proving that even in the face of adversity, one can rise and achieve greatness.</p>
	 </section>`,
		author: 'kakashi',
		cover: 'https://example.com/blog3_cover.jpg',
		likes: 8000,
		dislikes: 12,
		visibility: ['public'],
		slashtags: [
			'kakashi',
			'ninja',
			'hokage',
			'shinobi',
			'naruto',
			'team7',
			'copyNinja',
			'sharingan',
			'konoha',
			'ninjutsu',
			'obito',
			'rin',
			'minato',
			'fourthwar',
			'allyforces',
			'madarauchiha',
			'tentails',
			'guy',
			'jiriaya',
			'tsunade',
			'resilience',
			'redemption',
			'mentor',
			'warrior',
			'legend',
			'training',
			'genius',
			'strategy',
			'tactics',
			'hero'
		],
		views: 11000,
		created_at: new Date(Date.now())
	},
	{
		id: 'blog4',
		title: 'Journey to Become a Pokemon Master',
		content: `
	 <section>
	   <p>Ash Ketchum's journey to becoming a Pokemon Master is a story of determination, friendship, and adventure. Starting from the small town of Pallet, Ash's dream was to become the greatest Pokemon trainer in the world. With his loyal companion Pikachu by his side, Ash traveled through various regions, encountering new friends, battling skilled trainers, and capturing diverse Pokemon. His battles against Gym Leaders and participation in Pokemon Leagues showcased his growth as a trainer. Despite numerous challenges and setbacks, Ash's unyielding spirit and the bonds he formed with his Pokemon and friends helped him achieve his goals. Each step of his journey taught him valuable lessons about trust, perseverance, and the true meaning of being a Pokemon Master.</p>
	 </section>
	 <section>
	   <p>Ash's journey began in the small town of Pallet, where he received his first Pokemon, Pikachu, from Professor Oak. The bond between Ash and Pikachu was rocky at first, with Pikachu reluctant to trust his new trainer. However, through perseverance and acts of bravery, Ash earned Pikachu's trust, laying the foundation for a lifelong partnership.</p>
	   <p>The duo's first major challenge was facing off against the Viridian Gym, where they encountered formidable opponents. Despite the odds, Ash's determination and Pikachu's strength allowed them to secure their first badge, marking the beginning of their journey to becoming Pokemon Masters.</p>
	   <p>As Ash traveled through different regions, he met various friends who became integral parts of his journey. Misty, the Cerulean City Gym Leader, and Brock, the Pewter City Gym Leader, joined Ash on his adventures, each bringing their unique skills and personalities. Their camaraderie and support helped Ash overcome numerous obstacles, highlighting the importance of friendship and teamwork.</p>
	 </section>
	 <section>
	   <p>Ash's battles against Gym Leaders were pivotal moments in his journey. Each battle was a test of his skills and strategies, pushing him to think creatively and adapt to different situations. These encounters were not just about winning badges but also about learning and growing as a trainer.</p>
	   <p>One of the most memorable battles was against Sabrina, the Saffron City Gym Leader known for her powerful Psychic-type Pokemon. The battle was intense, with Ash facing overwhelming odds. However, his ingenuity and the bond with his Pokemon allowed him to emerge victorious, earning him the Marsh Badge and further solidifying his resolve to become a Pokemon Master.</p>
	   <p>Throughout his journey, Ash also participated in various Pokemon Leagues, each presenting its own set of challenges. The Indigo League, held in the Kanto region, was Ash's first major tournament. Despite not winning the championship, Ash's performance was commendable, showcasing his growth and determination.</p>
	 </section>
	 <section>
	   <p>Ash's adventures took him beyond Kanto, to regions like Johto, Hoenn, Sinnoh, and Unova. In each region, he encountered new Pokemon, faced tougher challenges, and formed new friendships. His journey through these regions was marked by significant battles, including his encounters with legendary Pokemon like Lugia, Ho-oh, and Latios.</p>
	   <p>One of the highlights of Ash's journey was his participation in the Sinnoh League, where he faced off against Tobias, a trainer known for his use of legendary Pokemon. The battle was fierce, with Ash putting up a valiant fight against Tobias's Darkrai and Latios. Although Ash did not win, his performance was a testament to his growth and the strength of his bond with his Pokemon.</p>
	   <p>The bond between Ash and Pikachu remained the cornerstone of his journey. Their partnership evolved over time, with Pikachu becoming not just a loyal companion but also Ash's most trusted and powerful Pokemon. Their synergy in battles was unmatched, often turning the tide in Ash's favor.</p>
	 </section>
	 <section>
	   <p>Ash's journey also highlighted the importance of mentoring and passing on knowledge. Throughout his travels, he met and mentored younger trainers, sharing his experiences and helping them grow. Characters like May, Dawn, and Serena benefitted from Ash's guidance, each going on to achieve their own goals and dreams.</p>
	   <p>The culmination of Ash's journey was his participation in the Alola League, where he finally achieved his dream of becoming a Pokemon Champion. The victory was a culmination of years of hard work, dedication, and growth. It was a moment of triumph not just for Ash but for all his friends and Pokemon who had supported him along the way.</p>
	   <p>In conclusion, Ash Ketchum's journey to becoming a Pokemon Master is a story of perseverance, friendship, and growth. From his humble beginnings in Pallet Town to his victory in the Alola League, Ash's adventures have inspired countless fans around the world. His journey is a testament to the power of dreams and the importance of never giving up, no matter the obstacles.</p>
	 </section>`,
		author: 'ash',
		cover:
			'https://www.pockettactics.com/wp-content/sites/pockettactics/2023/01/Pok%C3%A9mon-wallpapers-6.jpg',
		likes: 528630009,
		dislikes: 8,
		visibility: ['public'],
		slashtags: [
			'pokemon',
			'ashketchum',
			'pikachu',
			'gymleaders',
			'pokemonleague',
			'kanto',
			'johto',
			'hoenn',
			'sinnoh',
			'unova',
			'alola',
			'trainer',
			'pokemonmaster',
			'battles',
			'friendship',
			'adventure',
			'legendarypokemon',
			'indigoleague',
			'champion',
			'mentorship',
			'trust',
			'perseverance',
			'growth',
			'dreams',
			'victory',
			'training',
			'pokemonjourney',
			'anime',
			'nintendo'
		],
		views: 85128633746,
		created_at: new Date(Date.now())
	},
	{
		id: 'blog5',
		title: 'The Leadership Chronicles of Optimus Prime',
		content: `
	 <section>
	   <p>Optimus Prime, the leader of the Autobots, has always been a beacon of hope and courage. His leadership is marked by his unwavering commitment to freedom and justice. As a young Autobot, Optimus, known then as Orion Pax, believed in the potential for a peaceful future. His transformation into Optimus Prime was not just a change of name, but a shift in purpose. Leading the Autobots in their fight against the Decepticons, Optimus has faced countless battles, each more challenging than the last. His strategic mind, combined with his compassion and bravery, has earned him the respect of both his allies and enemies. Optimus Prime's journey is a testament to the strength of leadership and the power of believing in a better tomorrow.</p>
	 </section>
	 <section>
	   <p>Optimus Prime's journey began on Cybertron, a planet torn apart by civil war between the Autobots and the Decepticons. As Orion Pax, he was a humble dockworker with dreams of a better future. His life changed forever when he met Megatron, who was then a gladiator fighting for equality. Inspired by Megatron's vision, Orion joined the cause, but it wasn't long before he realized Megatron's true intentions of domination and control.</p>
	   <p>Recognizing the need for true leadership, Orion sought out the wisdom of the ancient Autobot leader, Alpha Trion. Under Alpha Trion's guidance, Orion was reformed into Optimus Prime, the bearer of the Matrix of Leadership. This transformation was both physical and ideological, marking the beginning of his journey as the leader of the Autobots.</p>
	   <p>Optimus Prime's leadership was defined by his unwavering commitment to freedom and justice. His first major challenge came in the form of the Battle of Iacon, where he led the Autobots in a desperate defense against the Decepticons. Despite being outnumbered, Optimus's strategic brilliance and indomitable spirit turned the tide, securing a crucial victory for the Autobots.</p>
	 </section>
	 <section>
	   <p>The war for Cybertron was long and grueling, with Optimus Prime facing numerous challenges both on and off the battlefield. One of his most significant battles was against Megatron himself. The two leaders, once friends and now bitter enemies, clashed repeatedly, each battle more intense than the last. Their final confrontation on Cybertron was a turning point, with Optimus emerging victorious but at great cost.</p>
	   <p>With Cybertron in ruins, Optimus Prime made the difficult decision to lead the Autobots to Earth. This new world presented its own set of challenges, as the Autobots sought to protect humanity from the Decepticons while remaining hidden. Optimus's leadership was instrumental in forging alliances with humans, including military leaders and everyday citizens who would become crucial allies.</p>
	   <p>One of the most pivotal moments on Earth was the discovery of the AllSpark, a powerful artifact capable of creating new life. The battle to secure the AllSpark was fierce, with Optimus Prime demonstrating his willingness to sacrifice himself for the greater good. His selflessness inspired his fellow Autobots and their human allies, showcasing the true essence of leadership.</p>
	 </section>
	 <section>
	   <p>Optimus Prime's journey was also marked by his ability to inspire and mentor others. Characters like Bumblebee, Arcee, and Ironhide looked up to him not just as a leader but as a mentor and friend. His guidance helped them grow into formidable warriors, each playing a crucial role in the Autobots' ongoing battle against the Decepticons.</p>
	   <p>The conflict on Earth reached its peak with the arrival of Unicron, a malevolent entity capable of destroying entire planets. Optimus Prime's leadership was once again put to the test as he rallied the Autobots and their allies for a final stand. The battle against Unicron was epic, with Optimus sacrificing the Matrix of Leadership to save Earth. This act of heroism cemented his legacy as one of the greatest leaders in the universe.</p>
	   <p>Beyond the battles, Optimus Prime's leadership was characterized by his compassion and empathy. He understood the importance of maintaining morale and providing support to those under his command. His speeches often served as rallying cries, reminding the Autobots of their mission and the importance of their cause.</p>
	 </section>
	 <section>
	   <p>Optimus Prime's journey also highlighted the importance of redemption. Throughout the war, he encountered former Decepticons who sought to change their ways. Optimus welcomed them with open arms, believing in the potential for change and the power of forgiveness. This inclusive approach strengthened the Autobots' ranks and showcased the transformative power of leadership.</p>
	   <p>In conclusion, Optimus Prime's leadership chronicles are a testament to the strength, courage, and compassion that define true leadership. From his humble beginnings as Orion Pax to his legendary status as the leader of the Autobots, Optimus's journey is one of perseverance and unwavering commitment to the ideals of freedom and justice. His legacy continues to inspire, proving that even in the darkest of times, there is always hope for a better tomorrow.</p>
	 </section>`,
		author: 'optimus_prime',
		cover: 'https://example.com/blog5_cover.jpg',
		likes: 700,
		dislikes: 20,
		visibility: ['public'],
		slashtags: [
			'transformers',
			'optimusprime',
			'autobots',
			'decepticons',
			'leadership',
			'freedom',
			'justice',
			'cybertron',
			'megatron',
			'allies',
			'humans',
			'alliance',
			'allSpark',
			'sacrifice',
			'heroism',
			'bumblebee',
			'arcee',
			'ironhide',
			'unicron',
			'matrixofleadership',
			'redemption',
			'compassion',
			'inspiration',
			'mentor',
			'strategy',
			'tactics',
			'warrior',
			'legend',
			'battle',
			'hope'
		],
		views: 13000,
		created_at: new Date(Date.now())
	},
	{
		id: 'blog6',
		title: "Nightwing's Evolution: From Robin to Hero",
		content: `
		<section>
		  <p>Nightwing, formerly known as the original Robin, has evolved into a hero in his own right. After parting ways with Batman, Dick Grayson adopted the Nightwing persona and moved to Blüdhaven. His journey from sidekick to independent hero is marked by personal growth, intense training, and a commitment to justice. Nightwing's acrobatic skills and tactical prowess make him a formidable defender of Blüdhaven.</p>
		</section>
		<section>
		  <p>Nightwing's time as Robin was a period of learning and development under Batman's mentorship. The transition to Nightwing represented his desire to forge his own path and step out of Batman's shadow. Establishing himself in Blüdhaven, Nightwing faced new challenges and villains, proving his capability as a solo hero.</p>
		  <p>His combat style is a blend of acrobatics and martial arts, honed to perfection through years of rigorous training. Nightwing's ability to think on his feet and adapt to different situations makes him a versatile and unpredictable opponent. His partnership with Oracle, providing him with critical intelligence and tech support, further enhances his effectiveness as a hero.</p>
		</section>
		<section>
		  <p>Nightwing's evolution is also characterized by his strong sense of justice and dedication to protecting the innocent. He is driven by the desire to make a difference, not just in Blüdhaven but also in the wider world. His leadership skills have come to the fore in various team-ups with other heroes, showcasing his ability to inspire and lead.</p>
		  <p>In conclusion, Nightwing's journey from Robin to a hero in his own right is a testament to his resilience, determination, and unwavering commitment to justice. His legacy as a defender of Blüdhaven and a key member of the superhero community continues to inspire and motivate others.</p>
		</section>`,
		author: 'nightwing',
		cover: 'https://example.com/blog6_cover.jpg',
		likes: 15000,
		dislikes: 5,
		visibility: ['public'],
		slashtags: [
			'nightwing',
			'robin',
			'bludhaven',
			'hero',
			'batman',
			'justice',
			'acrobatics',
			'martialarts',
			'tactics',
			'oracle',
			'evolution',
			'independent',
			'legacy',
			'protector',
			'crimefighter'
		],
		views: 20000,
		created_at: new Date('2024-07-01T10:00:00Z')
	},
	{
		id: 'blog7',
		title: 'Joker: The Clown Prince of Crime',
		content: `
		<section>
		  <p>The Joker, Gotham's most notorious villain, is known for his chaotic and unpredictable nature. His crimes are marked by a blend of dark humor and extreme violence, making him one of Batman's most challenging adversaries. The Joker's origins are shrouded in mystery, adding to his enigmatic and terrifying persona.</p>
		</section>
		<section>
		  <p>The Joker's relationship with Batman is a complex interplay of obsession and enmity. He views Batman not just as an enemy but as a counterpart, someone who brings meaning to his existence. Their confrontations are as much psychological battles as they are physical, with the Joker constantly testing Batman's limits and morals.</p>
		  <p>Despite his madness, the Joker is a criminal mastermind with a sharp intellect and an uncanny ability to manipulate those around him. His plans are often elaborate and meticulously executed, showcasing his strategic mind and deep understanding of human nature. The Joker's unpredictability makes him a constant threat to Gotham and its inhabitants.</p>
		</section>
		<section>
		  <p>The Joker's influence extends beyond Gotham, inspiring other villains and striking fear into the hearts of even the bravest heroes. His legacy is one of chaos and destruction, but also of a twisted brilliance that challenges conventional notions of villainy. The Joker's story is a dark mirror to Batman's, reflecting the thin line between order and chaos, sanity and madness.</p>
		  <p>In conclusion, the Joker remains one of the most iconic and enduring villains in comic book history. His chaotic nature, complex relationship with Batman, and twisted brilliance make him a formidable and fascinating adversary. The Joker's legacy as the Clown Prince of Crime continues to captivate and horrify, a testament to the enduring power of his character.</p>
		</section>`,
		author: 'joker',
		cover: 'https://example.com/blog7_cover.jpg',
		likes: 18000,
		dislikes: 20,
		visibility: ['public'],
		slashtags: [
			'joker',
			'batman',
			'villain',
			'gotham',
			'chaos',
			'crime',
			'darkhumor',
			'strategy',
			'intellect',
			'manipulation',
			'adversary',
			'obsession',
			'madness',
			'legacy',
			'clownprince'
		],
		views: 25000,
		created_at: new Date('2024-07-01T10:00:00Z')
	},
	{
		id: 'blog8',
		title: "Green Lantern's Light: The Heroic Journey of Hal Jordan",
		content: `
		<section>
		  <p>Hal Jordan, the Green Lantern of Sector 2814, is a beacon of hope and courage. Chosen for his ability to overcome great fear, Hal wields the power ring to protect the universe from threats both terrestrial and cosmic. His journey as a Green Lantern is marked by heroism, sacrifice, and unwavering commitment to justice.</p>
		</section>
		<section>
		  <p>Hal's transformation into the Green Lantern began when he was chosen by the dying Abin Sur to inherit the power ring. This event set him on a path of interstellar adventure and conflict, as he joined the Green Lantern Corps and learned to harness the ring's power. Hal's fearlessness and determination quickly made him one of the Corps' most respected members.</p>
		  <p>Throughout his career, Hal has faced numerous challenges, from intergalactic tyrants to cosmic entities. His battles against foes like Sinestro, his former mentor turned arch-nemesis, have tested his resolve and pushed his powers to their limits. Hal's ability to inspire and lead has been instrumental in many of the Corps' victories.</p>
		</section>
		<section>
		  <p>One of Hal's defining traits is his unyielding willpower, the source of his strength as a Green Lantern. His ability to create constructs limited only by his imagination makes him a versatile and formidable hero. Hal's leadership during crises, such as the War of Light and the Blackest Night, has been crucial in uniting the various Lantern Corps against common threats.</p>
		  <p>In addition to his interstellar duties, Hal has maintained strong ties to Earth, often balancing his responsibilities as a Green Lantern with his personal life. His relationships with fellow heroes, such as the Justice League, have further solidified his status as a key defender of Earth.</p>
		</section>
		<section>
		  <p>Hal Jordan's journey as the Green Lantern is a testament to the power of courage and willpower. His legacy as one of the greatest Green Lanterns in history is defined by his heroic deeds, his leadership, and his unwavering commitment to justice. Hal's story continues to inspire and illuminate the path for new generations of heroes.</p>
		</section>`,
		author: 'green_lantern',
		cover: 'https://example.com/blog8_cover.jpg',
		likes: 12000,
		dislikes: 8,
		visibility: ['public'],
		slashtags: [
			'greenlantern',
			'haljordan',
			'justiceleague',
			'hero',
			'willpower',
			'courage',
			'power ring',
			'lanterncorps',
			'sinestro',
			'leadership',
			'sacrifice',
			'interstellar',
			'justice',
			'legacy',
			'inspiration'
		],
		views: 22000,
		created_at: new Date('2024-07-01T10:00:00Z')
	},
	{
		id: 'blog9',
		title: 'Ironman: The Armored Avenger',
		content: `
		<section>
		  <p>Ironman, also known as Tony Stark, is a genius billionaire who uses his intellect and resources to create advanced technology and armor suits. As a founding member of the Avengers, Ironman's journey is one of innovation, heroism, and personal growth. His legacy as the Armored Avenger is marked by his contributions to science and his relentless pursuit of justice.</p>
		</section>
		<section>
		  <p>Tony Stark's transformation into Ironman began after he was captured by terrorists and forced to build a weapon. Instead, he created the first Ironman suit to escape captivity, marking the beginning of his career as a superhero. This experience profoundly changed Tony, inspiring him to use his inventions for the greater good.</p>
		  <p>Ironman's journey is characterized by constant innovation and improvement of his suits. Each new iteration of the Ironman armor reflects Tony's growth as an inventor and a hero. His suits are equipped with advanced weaponry, defense systems, and artificial intelligence, making him a formidable force in battle.</p>
		</section>
		<section>
		  <p>As a member of the Avengers, Ironman has played a crucial role in defending the Earth from various threats. His leadership and strategic mind have been instrumental in numerous victories. Tony's relationship with his fellow Avengers, particularly Captain America, has been a driving force in his development as a leader.</p>
		  <p>Beyond his heroics, Tony Stark's journey is also one of personal growth and redemption. His struggle with his own demons, such as his battle with alcoholism, adds depth to his character. Tony's determination to overcome his flaws and become a better person is a key aspect of his story.</p>
		</section>
		<section>
		  <p>Ironman's legacy is defined by his contributions to science and his impact on the superhero community. His innovations have paved the way for advancements in technology and have inspired other heroes to follow in his footsteps. Tony's story is a testament to the power of intellect and the importance of using one's abilities for the greater good.</p>
		  <p>In conclusion, Ironman's journey as the Armored Avenger is a story of heroism, innovation, and personal growth. Tony Stark's legacy continues to inspire and motivate, proving that even the most flawed individuals can achieve greatness through determination and ingenuity.</p>
		</section>`,
		author: 'ironman',
		cover: 'https://example.com/blog9_cover.jpg',
		likes: 17000,
		dislikes: 12,
		visibility: ['public'],
		slashtags: [
			'ironman',
			'tonystark',
			'avengers',
			'genius',
			'billionaire',
			'technology',
			'innovation',
			'armorsuit',
			'hero',
			'justice',
			'redemption',
			'leadership',
			'science',
			'invention',
			'legacy'
		],
		views: 28000,
		created_at: new Date('2024-07-01T10:00:00Z')
	},
	{
		id: 'blog10',
		title: 'Saitama: The Hero for Fun',
		content: `
		<section>
		  <p>Saitama, also known as One Punch Man, is a hero who can defeat any opponent with a single punch. His journey is marked by his quest for a worthy opponent and the pursuit of heroism for fun. Despite his overwhelming power, Saitama remains humble and dedicated to protecting the innocent.</p>
		</section>
		<section>
		  <p>Saitama's journey began as an ordinary man who decided to become a hero after a life-changing encounter with a villain. Through rigorous training, he gained unparalleled strength, but at the cost of losing his hair. His training regimen, which he claims to be simple, is the source of his incredible power.</p>
		  <p>Despite his strength, Saitama struggles with the mundanity of being unbeatable. His search for a challenging opponent leads him to join the Hero Association, where he meets other heroes and takes on various missions. Saitama's interactions with his disciple, Genos, and other heroes highlight his unconventional approach to heroism.</p>
		</section>
		<section>
		  <p>Saitama's battles are characterized by their brevity, as he defeats even the most formidable foes with ease. However, his journey is not just about fighting but also about finding meaning and satisfaction in his heroics. His humility and lack of recognition from the Hero Association add a layer of complexity to his character.</p>
		  <p>One of Saitama's most significant battles is against Boros, an alien conqueror. The fight, although brief, showcases Saitama's full strength and his indifference to his own power. Saitama's victory over Boros reinforces his status as the strongest hero but also deepens his existential crisis.</p>
		</section>
		<section>
		  <p>In conclusion, Saitama's journey as the Hero for Fun is a unique take on the superhero genre. His overwhelming power and humble demeanor make him an intriguing character. Saitama's story is a commentary on the nature of heroism and the search for purpose, proving that even the strongest heroes face their own challenges.</p>
		</section>`,
		author: 'saitama',
		cover: 'https://example.com/blog10_cover.jpg',
		likes: 14000,
		dislikes: 7,
		visibility: ['public'],
		slashtags: [
			'saitama',
			'onepunchman',
			'hero',
			'fun',
			'strength',
			'heroassociation',
			'genos',
			'battles',
			'humility',
			'recognition',
			'existential',
			'purpose',
			'power',
			'journey',
			'superhero'
		],
		views: 19000,
		created_at: new Date('2024-07-01T10:00:00Z')
	},
	{
	  id: 'blog11',
	  title: "Jason's Adventures: Turning Mecard",
	  content: `
	  <section>
		<p>Jason, the hero from the world of Turning Mecard, is known for his bravery and strategic mind. His journey is filled with thrilling mech battles and adventures as he strives to protect the Mecardimals and maintain peace. Jason's determination and leadership have made him a key figure in the Mecard world.</p>
	  </section>
	  <section>
		<p>Jason's journey began when he discovered the existence of Mecardimals, mechanical creatures with extraordinary abilities. His bond with these creatures grew as he learned to control and battle with them. Jason's strategic thinking and quick decision-making were crucial in overcoming numerous challenges and adversaries.</p>
		<p>Throughout his adventures, Jason faced various villains and threats to the Mecard world. His encounters with the villainous Black Mirror tested his skills and resolve. With the help of his friends and allies, Jason managed to thwart Black Mirror's plans and protect the Mecardimals from harm.</p>
	  </section>
	  <section>
		<p>Jason's battles were not just physical confrontations but also tests of his leadership and teamwork. His ability to inspire and lead his friends into battle played a significant role in their victories. Jason's journey is a testament to the power of friendship and the importance of standing up for what is right.</p>
		<p>In conclusion, Jason's adventures in the world of Turning Mecard are a thrilling saga of bravery, strategy, and friendship. His journey continues to inspire and captivate, proving that even in the face of great challenges, determination and teamwork can lead to victory.</p>
	  </section>`,
	  author: 'jason',
	  cover: 'https://example.com/blog11_cover.jpg',
	  likes: 13000,
	  dislikes: 10,
	  visibility: ['public'],
	  slashtags: [
		'jason', 'turningmecard', 'mecardimals', 'mechbattles', 'adventure',
		'strategy', 'leadership', 'friendship', 'bravery', 'villains',
		'blackmirror', 'heroes', 'determination', 'teamwork', 'inspiration'
	  ],
	  views: 21000,
	  created_at: new Date('2024-07-01T10:00:00Z')
	}
]
async function push() {
	for (const user of users) {
		await db.create({
			table: 'users',
			data: user
		})
		console.log('done creating user', user.username)
	}

	for (const blog of blogs) {
		await db.create({
			table: 'blogs',
			data: blog
		})
		console.log('done creating blog', blog.title)
	}

	process.exit(0)
}

push()
