import { Form, FloatingLabel, Button } from "react-bootstrap";
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { loginEmailSenha, CadastrarEmailSenha } from "../../firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import logoIcon from "../../assets/icons/login.png";
import { addUsuario } from "../../firebase/usuarios";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

export function Cadastro() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    async function onSubmit(data) {
        const codigo = data.codigo;
        const turmasRef = collection(db, "turmas");
        const q = query(turmasRef, where("codigo", "==", codigo));
        const querySnapshot = await getDocs(q);
        let turmaEncontrada;
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            turmaEncontrada = doc.data()
        });

        if (querySnapshot.size > 0 && turmaEncontrada.email.includes(data.email)) {
            const { nome, codigo, email, senha } = data;
            CadastrarEmailSenha(nome, codigo, email, senha)
                .then((user) => {
                    toast.success(`Bem-vindo(a) ${user.email}`,
                        { position: "bottom-right", duration: 2500 });
                    loginEmailSenha({ email: data.email, senha: data.senha })
                        .then((user) => {
                            toast.success(`Entrando como ${user.email}`, {
                                position: "bottom-right",
                                duration: 2500,
                            });
                            addUsuario(user).then(() => {
                                console.log("Usuário adicionado com sucesso");
                            });
                            navigate("/");
                        });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(`Erro ao cadastrar usuário: ${error}`, { position: "bottom-right", duration: 2500 });
                });
        } else {
            toast.error(`Código de turma inválido, ou Usuário não permitido`, { position: "bottom-right", duration: 2500 });
        }
    }
    useEffect(() => {
        setUser(localStorage.getItem('user'));
        setPass(localStorage.getItem('password'));
    }, []);

    return (
        <div className="backgroundCadastroLogin">

            <Form className="form-card" onSubmit={handleSubmit(onSubmit)}>
                <img variant="top" src={logoIcon} width="256" alt="Logo do App" style={{ display: 'block', margin: 'auto', width: '20%' }} />
                <h1 className="text-center mb-4">SoulReviews</h1>
                <p className="text-muted text-center">
                    Já tem conta? <Link to="/login">Entre</Link>
                </p>
                <hr />
                <h2 className="text-center m-4">Faça seu cadastro na nossa plataforma!</h2>
                <FloatingLabel
                    controlId="nome"
                    label="Nome"
                    className="mb-3 mt-4"
                >
                    <Form.Control
                        type="nome"
                        placeholder="Nome"
                        className={errors.nome && "is-invalid"}
                        {...register("nome", { required: "O campo nome é obrigatório!" })}
                        defaultValue={user} />
                    {errors.nome && <Form.Text className="invalid-feedback">{errors.nome.message}</Form.Text>}
                </FloatingLabel>
                <FloatingLabel
                    controlId="codigo"
                    label="Código da Turma"
                    className="mb-3 mt-4"
                >
                    <Form.Control
                        type="codigo"
                        placeholder="Código da Turma"
                        className={errors.codigo && "is-invalid"}
                        {...register("codigo", { required: "O campo Código da Turma é obrigatório!" })}
                        defaultValue={user} />
                    {errors.codigo && <Form.Text className="invalid-feedback">{errors.codigo.message}</Form.Text>}
                </FloatingLabel>
                <FloatingLabel
                    controlId="email"
                    label="E-mail"
                    className="mb-3 mt-4"
                >
                    <Form.Control
                        type="email"
                        placeholder="E-mail"
                        className={errors.email && "is-invalid"}
                        {...register("email", { required: "O campo e-mail é obrigatório!" })}
                        defaultValue={user} />
                    {errors.email && <Form.Text className="invalid-feedback">{errors.email.message}</Form.Text>}
                </FloatingLabel>
                <FloatingLabel
                    controlId="senha"
                    label="Senha"
                    className="mb-3"
                >
                    <Form.Control
                        type="password"
                        placeholder="Senha"
                        className={errors.senha && "is-invalid"}
                        {...register("senha", { required: "O campo senha é obrigatório!" })}
                        defaultValue={pass} />
                    {errors.senha && <Form.Text className="invalid-feedback">{errors.senha.message}</Form.Text>}
                </FloatingLabel>
                <div className="d-flex justify-content-end">
                    <Button type="submit" className="botao-login">Cadastrar</Button>
                </div>
            </Form>
        </div>
    );
}