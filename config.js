const db_params = {
	user: 'admin',
	password: 'pass',
	host: 'localhost',
	port: 27017,
	db: 'devices',
}

const db = {
	uri: `mongodb://${db_params.user}:${db_params.password}@${db_params.host}:${db_params.port}/${db_params.db}`,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
}

const app = {
	port: 3300,
}

export { db, app }
