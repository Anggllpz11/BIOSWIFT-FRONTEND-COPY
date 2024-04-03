export type User = {
    _id: string;
    number: number;
    username: string;
    password: string;
    name: string;
    cedula: number;
    telefono: string;
    email: string;
    more_info: string;
    roles: Array<{ _id: string; name: string }>;
    type: string;
    titulo: string;
    reg_invima: string
  };
  