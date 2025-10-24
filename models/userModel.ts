const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: "admin"
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: "user"
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: "user"
  },
];

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      password: string;
      role: string;
    }
  }
}

const userModel = {
  findOne: (email: string) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id: number | string) => {
    const user = database.find((user) => String(user.id) === String(id));
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  createOAuthUser: (profile: any) => {
    const newUser = {
      id: profile.id,
      name: profile.displayName || profile.username,
      email: profile.emails?.[0]?.value ?? null,
      password: "",
      role: "user",
      provider: "github",
    };
    database.push(newUser);
    return newUser;
  },
};

export { database, userModel };
