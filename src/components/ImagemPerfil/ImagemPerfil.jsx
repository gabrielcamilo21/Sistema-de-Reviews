import semFotoPerfil from "../../assets/images/perfilSemFoto.png"


export function ImagemPerfil({ imagem }) {
  
  return (
    <div className="aside">
      <img className="rounded-circle shadow w-100 p-0 img-thumbnail img-fluid"
        src={imagem ? imagem : semFotoPerfil}
        alt="Foto de perfil do usuário"        
        style={{ maxWidth: "200px", maxHeight: "200px", border: "1px solid dark"}}
      />                  
    </div>
  );
}