import { useState, useEffect } from "react";
import CategoriaContext from "./CategoriaContext";
import {
  getCategoriasAPI,
  getCategoriaPorCodigoAPI,
  deleteCategoriaPorCodigoAPI,
  cadastraCategoriaAPI,
} from "../../../components/services/CategoriaServico";
import Tabela from "./Tabela";
import Formulario from './Formulario';
import Carregando from '../../useful/Carregando';

function Categoria() {
  const [alerta, setAlerta] = useState({ status: "", message: "" });
  const [listaObjetos, setListaObjetos] = useState([]);
  const [editar, setEditar] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [exibirForm, setExibirForm] = useState(false);
  const [objeto, setObjeto] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    sigla: "",
  });

  const novoObjeto = () => {
    setEditar(false);
    setAlerta({ status: "", message: "" });
    setObjeto({
      codigo: 0,
      nome: "",
    });
    setExibirForm(true);
  };

  const editarObjeto = async (codigo) => {
    setObjeto(await getCategoriaPorCodigoAPI(codigo));
    setEditar(true);
    setAlerta({ status: "", message: "" });
    setExibirForm(true);
  };

  const acaoCadastrar = async (e) => {
    e.preventDefault();
    const metodo = editar ? "PUT" : "POST";
    try {
      let retornoAPI = await cadastraCategoriaAPI(objeto, metodo);
      setAlerta({ status: retornoAPI.status, message: retornoAPI.message });
      setObjeto(retornoAPI.objeto);
      if (!editar) {
        setEditar(true);
      }
    } catch (err) {
      console.error(err.message);
    }
    recuperaCategorias();
  };

  const remover = async (codigo) => {
    if (window.confirm("Deseja remover este objeto?")) {
      let retornoAPI = await deleteCategoriaPorCodigoAPI(codigo);
      setAlerta({ status: retornoAPI.status, message: retornoAPI.message });
      recuperaCategorias();
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setObjeto({ ...objeto, [name]: value });
  };

  useEffect(() => {
    recuperaCategorias();
  }, []);

  const recuperaCategorias = async () => {
    setCarregando(true);
    setListaObjetos(await getCategoriasAPI());
    setCarregando(false);
}

  return (
    <CategoriaContext.Provider
      value={{
        alerta,
        setAlerta,
        listaObjetos,
        remover,
        objeto,
        editarObjeto,
        acaoCadastrar,
        handleChange,
        novoObjeto,
        exibirForm,
      }}
    >
      <Carregando carregando={carregando}>
      <Tabela />
      </Carregando>
       <Formulario />
    </CategoriaContext.Provider>
  );
}

export default Categoria;
