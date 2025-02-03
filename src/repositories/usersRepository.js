class UserRepository {
    constructor(postgreClient) {
        this.postgreClient = postgreClient; 
    }

    async createUser(email) {
        try {
            const queryText = `
                INSERT INTO users(email)
                VALUES($1)
                RETURNING *; 
            `; 

            const values = [email]; 
            const { rows } = await this.postgreClient.pool.query(queryText, values); 

            return rows[0]; 
        } 
        
        catch (error) {
            console.error('Error in UserRepository creating user:', error.message);
            throw error; 
        }
    }

    async checkUser(email) {
        const queryText = `
            SELECT EXISTS(SELECT FROM users WHERE email = $1); 
        `;

        const values = [email]; 
        try {
            const response = await this.postgreClient.pool.query(queryText, values); 
            return response.rows[0].exists;
        } 
        
        catch (error) {
            console.error("Error in UserRepository checking if user exists", error.message);
            throw error; 
        }
    }


    async getUserByEmail(email) {
        const queryText = `
            SELECT * FROM users WHERE email = $1; 
        `;

        const values = [email]; 
        try {
            console.log(`query: ${queryText} values:${values}`); 
            const response = await this.postgreClient.pool.query(queryText, values);  
            return response.rows[0]; 
        } 
        
        catch (error) {
            console.error("Error in UserRepository finding user by email", error.message);
            throw error; 
        }
    }

    async deleteUser(email) {
        const queryText = `
            DELETE FROM users WHERE email = $1; 
        `; 

        const values = [email]; 
        try {
            const response = await this.postgreClient.pool.query(queryText, values); 
            return response.rows[0]; 
        } 
        
        catch (error) {
            console.error("Error in UserRepository deleting user", error.message);
            throw error; 
        }
    }
}

export default UserRepository; 