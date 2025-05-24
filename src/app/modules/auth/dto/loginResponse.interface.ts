export interface ILoginResponse {
    token: string;
    user:  User;
}

export interface User {
    id:           string;
    name:         string;
    lastName:     string;
    email:        string;
    phone:        string;
    address:      string;
    city:         string;
    password:     string;
    isActive:     boolean;
    role:         string;
    registerDate: Date;
}
