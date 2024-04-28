import db from './db'
const user = async () => {
	try {
		await db.command({
			query: `CREATE TABLE IF NOT EXISTS user (
        username String,
        user_number Int256 DEFAULT 0,
        name String,
        bio String DEFAULT '',
        email String,
        password String,
        followers Int256 DEFAULT 0,
        following Int256 DEFAULT 0,
        profile_picture String DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
        banner String DEFAULT '',
        level String DEFAULT 'Silent Soul',
        role String DEFAULT 'user',
        points Int256 DEFAULT 0,
        needs Int256 DEFAULT 100,
        links Array(String),
        verified Bool DEFAULT false,
        skills Array(String) DEFAULT [''],
        language Array(String) DEFAULT [''],
        joined DateTime64 DEFAULT now()
      ) ENGINE MergeTree()
      ORDER BY (username, name)
      PRIMARY KEY username`
		})
		console.log('user table created successfully')
	} catch (e) {
		console.error(e)
	}
}

async function push() {
	await user()
	console.log('pushed successfully')
}

push()
