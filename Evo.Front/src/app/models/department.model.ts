export type Department = {
    id: number,
    nome: string,
    sigla: string
}

export type DepartamentCadastro = Omit<Department, 'id'>;