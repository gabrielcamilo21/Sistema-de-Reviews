import { Form, FloatingLabel, Button } from "react-bootstrap";
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { loginEmailSenha } from "../../firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import logoIcon from "../../assets/icons/login.png"

export function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    function onSubmit(data) {
        if (data.lembrar) {
            localStorage.setItem('user', data.email);
            localStorage.setItem('password', data.senha);
        }

        loginEmailSenha({ email: data.email, senha: data.senha })
            .then((user) => {
                toast.success(`Entrando como ${user.email}`, {
                    position: "bottom-right",
                    duration: 2500,
                });
                navigate("/turmas");
            })
            .catch((err) => {
                toast.error(`Um erro aconteceu. Código: ${err.code}`, {
                    position: "bottom-right",
                    duration: 2500,
                });
            });
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
                    Não tem conta? <Link to="/Cadastro">Cadastre-se</Link>
                </p>
                <hr />
                <h2 className="text-center m-4">Faça login na nossa plataforma!</h2>
                <br />
                <FloatingLabel
                    controlId="email"
                    label="E-mail"
                    className="mb-3"
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
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <Form.Check type="checkbox" id="lembrar" {...register("lembrar")} /><Form.Label htmlFor="lembrar" className="ms-2">Lembrar de mim</Form.Label>
                    </div>
                    <Button type="submit" className="botao-login">Login</Button>
                </div>
            </Form>
        </div>
    );
}