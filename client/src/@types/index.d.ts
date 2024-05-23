type Avatar = string | File

interface SubmitRegisterData {
  email: string,
  password: string,
  username: string,
  info: string | Blob,
  avatar: Avatar
}

interface SubmitLoginData {
  email: string,
  password: string,
}

interface SubmitUpdateData {
  email: string,
  password: string,
  username: string,
  info: string | Blob,
  avatar: Avatar,
}
interface SubmitUpdateSketch {
  owner: string | Blob,
  name: string,
  comment: string | Blob,
  url: Avatar,
  battle: string
}