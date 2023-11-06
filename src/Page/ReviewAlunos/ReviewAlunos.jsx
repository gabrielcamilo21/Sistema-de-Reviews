import { Form, FloatingLabel, Button, Container, Table, Accordion } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "../../firebase/reviews";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { isSameDay, parseISO } from 'date-fns'
import isValid from 'date-fns/isValid'

export function ReviewAlunos() {
    const usuarioLogado = useContext(AuthContext);
    const [reviews, setReviews] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [dataInicio, setDataInicio] = useState(null);

    useEffect(() => {
        initializeTable();
    }, []);

    async function initializeTable() {
        const reviews = await getReviews(usuarioLogado.uid);
        let reviewsFiltrados = reviews;
        if (dataInicio && isValid(dataInicio)) {
            reviewsFiltrados = reviews.filter((review) => {
                const dataReview = review.dataEnvio.toDate()
                return isSameDay(dataReview, dataInicio)
            });
        }

        const formattedReviews = reviewsFiltrados.map((review) => {
            const dataEnvio = new Date(review.dataEnvio.seconds * 1000);
            const dataFormatada = dataEnvio.toLocaleDateString();
            return { ...review, dataEnvio: dataFormatada };
        });
        formattedReviews.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));

        setReviews(formattedReviews);
    }
    useEffect(() => {
        initializeTable()
    }, [dataInicio])

    const onSubmit = async (data) => {
        const dataAtual = new Date().toISOString();
        const formattedDataAtual = dataAtual.substring(0, 10);
        const reviews = await getReviews(usuarioLogado.uid);
        const dataExistente = reviews && reviews.some((review) => {
            const reviewData = new Date(review.dataEnvio.seconds * 1000).toISOString().substring(0, 10);
            reset();
            return reviewData === formattedDataAtual;
        });

        if (dataExistente) {
            toast.error("Já existe um review com a data de hoje!", { duration: 2000, position: "bottom-right" });
            return;
        }

        data.dataEnvio = new Date(dataAtual);
        data.idAluno = usuarioLogado.uid;

        addReview(data)
            .then(() => {
                toast.success("Review cadastrado com sucesso", { duration: 2000, position: "bottom-right" });
                initializeTable();
            })
            .catch((error) => {
                toast.error("Erro ao cadastrar review", { duration: 2000, position: "bottom-right" });
                console.error(error);
            });
    };

    return (

        <Container className="backgroundCard">
            <div className="d-flex justify-content-between align-items-center">
                <h1>Reviews do Aluno</h1>
            </div>
            <hr />
            <Container className="backgroundCardContainer d-flex justify-content-between">
                <Container className="backgroundCardDireita">
                    <div className="chatProfDiv">
                        <span className="chatProf">Escrever:</span>
                    </div>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FloatingLabel style={{ margin: "10px" }}>
                            <Form.Control
                                type="text"
                                as="textarea"
                                className={`textarea2 ${errors.review && "is-invalid"}`}
                                {...register("review", {})} />
                            {errors.review && (
                                <Form.Text className="invalid-feedback">
                                    {errors.review.message}
                                </Form.Text>
                            )}
                        </FloatingLabel>
                        <FloatingLabel className="d-flex justify-content-between align-items-center">
                            <Button
                                variant="outline-warning"
                                type="submit"
                                style={{ margin: '10px' }}>
                                Enviar
                            </Button>
                            <Button
                                variant="outline-warning"
                                as={Link} to={`/perfil`}
                                style={{ margin: '10px' }}>
                                Voltar
                            </Button>
                        </FloatingLabel>
                        <span className="chatProf">Filtrar:</span>
                        <div className="filtroData">
                            <FloatingLabel >
                                <div className="date-input-container"></div>
                                <Form.Control

                                    type="date"
                                    {...register("datainicio")}
                                    onChange={(e) => setDataInicio(parseISO(e.target.value + "T00:00:00"))}
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', lineHeight: '1.5', width: '150px' }} />
                            </FloatingLabel>
                        </div>
                    </Form>
                    <Table>
                        <thead>
                            <tr>
                                <th>Histórico</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews && reviews.slice(0, 5).map((review) => {
                                return (
                                    <tr key={review.id}>
                                        <td className="no-border">
                                            <Accordion defaultActiveKey={null}>
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header className="bg-dark">{review.dataEnvio}</Accordion.Header>
                                                    <Accordion.Body className="bg-dark" style={{ textAlign: "left" }}>
                                                        {review.review}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Container>
            </Container>
        </Container>
    );
}
