## Password Encyption

- We're going to use a library called [**BCrypt**](https://www.npmjs.com/package/bcrypt) to help us encrypt passwords. This means that even though we can see the password property in our database, it will have been scrambled into an unrecognizable code, keeping our users' data safe and private, even from us! The first step is to install the package.

- Create a folder called 'lib' (for libraries), or 'utils' (for utilities). This is where we can store all extra 'helper' functions that we write or import. Create a `.js` file for bycrypt. We're going to write two main functions using the bcrypt library - one to **hash** the password into a code, and the other will be to **compare** the hashed password in our database to the unhashed password entered by the user for authentication. 

- The two steps of encrypting a password are to generate [**salt**](https://itecnote.com/tecnote/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt/) with `bcrypt.genSalt()`, which is then used to hash with `bcrypt.hash()`. BCrypt docs show how this can be done in one or two seperate functions. We'll put it together in one function using async/await, make sure to export it so it can be used in your register function. You will have to specify how many **salt rounds** - the more rounds, the higher the **cost factor**, and so the longer it will take to scramble and unscramble the data. The recommended default is 10:

```js
import bcrypt from "bcrypt";

export const encryptPassword = async(password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword
  } catch(error) {
    console.log("Error: ", error);
  }
}
```

- We now want to import and call this function on our password _before_ we send it to the database. Make sure to use **await**, since it is an asynchronous function!

- We will need to use `bycrypt.compare()` to check whether a plain text and a hashed text are actually the same string. We'll write and export a short function now, so that it's there for us when we want create a user log-in. This function will return **true** or **false**:

```js
export const verifyPassword = async (password, hashedPassword) => {
  const verified = bcrypt.compare(password, hashedPassword);
  return verified;
};
```

## React Context with Typescript

- Writing a [Context with Typescript](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/) can be a little bit tricky. The first thing we'll need to do is create a **type** or **interface** to define the shape of our Context:

```ts
interface User {
  password: string,
  email: string,
  username: string,
  avatar: string,
  pets: string[]
}

interface AuthContextType {
  user: User | null,
  login(email: string, password: string): void,
}
```

- We then need to create context. In the past, we've initalized it to be empty, but then Typescript would infer the type to be nothing and we would never be able to use it! Which means we need to strictly type it. Since our Context doesn't exist yet, the first (but not recommended) way is to type it as either null | your Context type. This, however, means that Typescript is always going to perceive the Context as potentially null, and you'll need to do conditional checks every single time you want to use it.

- A shortcut way to assure Typescript that your Context isn't null is to set the initial value to either `null!` or an empty object `as` your context type:

```js
const CurrentUserContext = createContext<CurrentUserContextType>({} as CurrentUserContextType);
```
```js
const CurrentUserContext = createContext<CurrentUserContextType>(null!);
```

- The most recommended way is to create an 'initialValue' variable, which conforms to your type. In our case, the Context variables would be 'null', and any functions would simply throw errors to explain they're not yet being implimented. Think of it like a placeholder. By the time the app loads, though, the true Context will have been created:

```ts
const initialAuth: AuthContextValue = {
  user: null,
  login: () => {
    throw new Error('login not implemented.');
  }
};

export const AuthContext = createContext<AuthContextType>(initialAuth);
```

- The most tedious part of this process will be the need to update both our type and our initialValue variable each time we add, remove, or change something on our Context. 