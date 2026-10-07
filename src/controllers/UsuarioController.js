const UsuarioService = require("../services/UsuarioService");

class UsuarioController {
  async listar(req, res) {
    try {
      const resultado = await UsuarioService.listarUsuarios();
      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async buscarPorId(req, res) {
    try {
      const resultado = await UsuarioService.buscarUsuarioPorId(req.params.id);
      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async cadastrar(req, res) {
    /*  #swagger.parameters['body'] = {
                in: 'body',
                description: 'Dados do novo usuário',
                schema: {
                    $nome: 'Administrador',
                    $email: 'admin@sabordigital.com',
                    $senha: '123456',
                    papel: 'admin'
                }
            }
        */
    try {
      const dados = { ...req.body };
      const resultado = await UsuarioService.cadastrarUsuario(dados);
      res.status(201).json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const resultado = await UsuarioService.login(email, senha);
      res.status(200).json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async atualizar(req, res) {
    try {
      const dados = { ...req.body };
      const resultado = await UsuarioService.atualizarUsuario(
        req.params.id,
        dados,
      );
      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async deletar(req, res) {
    try {
      const resultado = await UsuarioService.deletarUsuario(req.params.id);
      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }
}

module.exports = new UsuarioController();
