import { Form, FloatingLabel, Button, Container, Table, Accordion } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { isSameDay, parseISO } from 'date-fns'
import { addReview, getReviews } from "../../firebase/reviews";
import isValid from 'date-fns/isValid'
import { getUsuario } from "../../firebase/usuarios";

export function ReviewProfessor() {
    const usuarioLogado = useContext(AuthContext);
    const [reviews, setReviews] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [dataInicio, setDataInicio] = useState(null);
    const { id } = useParams();
    const [dadoAluno, setDadoAluno] = useState({});

    useEffect(() => {
        initializeTable();
        getUsuario(id).then(setDadoAluno);
    }, []);

    async function initializeTable() {
        const reviews = await getReviews(id);
        let reviewsFiltrados = reviews;
        if (dataInicio && isValid(dataInicio)) {
            reviewsFiltrados = reviews.filter((review) => {
                const dataReview = review.dataEnvio.toDate();
                return isSameDay(dataReview, dataInicio);
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
        initializeTable();
    }, [dataInicio]);

    const onSubmit = async (data) => {
        const dataAtual = new Date().toISOString();
        const formattedDataAtual = dataAtual.substring(0, 10);
        const reviews = await getReviews(usuarioLogado.uid);
        const dataExistente = reviews && reviews.some((review) => {
            const reviewData = new Date(review.dataEnvio.seconds * 1000).toISOString().substring(0, 10);
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
            <div className="d-flex justify-content-start align-items-center">
                <img className= "fotoFeed m-2 rounded-circle shadow p-0 img-thumbnail img-fluid" src={dadoAluno.photoURL}/><h1 className="m-2">Reviews: {dadoAluno.nome} - {dadoAluno.idTurma}</h1>
            </div>
            <hr />

            <Container className="backgroundCardContainer d-flex justify-content-between">
                <Container className="backgroundCardFeedback">
                    <FloatingLabel className="d-flex justify-content-between align-items-center">
                        <Button
                            className="tipo2"
                            variant="outline-warning"
                            as={Link} to={`/feedbackdoprofessor/${id}`}
                            type="submit">
                            Feedbacks
                        </Button>
                    </FloatingLabel>
                </Container>
                <Container className="backgroundCardDireita">
                    <div className="chatProfDiv">
                        <span className="chatProf">Filtrar:</span>
                    </div>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {errors.review && (
                            <Form.Text className="invalid-feedback">
                                {errors.review.message}
                            </Form.Text>
                        )}
                        <FloatingLabel style={{ margin: "10px" }}>
                            <Form.Control
                                type="date"
                                {...register("datainicio")}
                                onChange={(e) => setDataInicio(parseISO(e.target.value + "T00:00:00"))}
                            />
                        </FloatingLabel>
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
