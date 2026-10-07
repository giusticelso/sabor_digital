const UsuarioRepository = require("../repositories/UsuarioRepository");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UsuarioService {
  async listarUsuarios() {
    const usuarios = await UsuarioRepository.findAll();
    return {
      sucesso: true,
      dados: usuarios,
      total: usuarios.length,
    };
  }

  async buscarUsuarioPorId(id) {
    if (!id || isNaN(id)) {
      throw { status: 400, mensagem: "ID inválido" };
    }

    const usuario = await UsuarioRepository.findById(id);
    if (!usuario) {
      throw { status: 404, mensagem: "Usuário não encontrado" };
    }

    return {
      sucesso: true,
      dados: usuario,
    };
  }

  async cadastrarUsuario(dados) {
    const { nome, email, senha, papel } = dados;

    if (!nome || !email || !senha) {
      throw { status: 400, mensagem: "Nome, e-mail e senha são obrigatórios" };
    }

    // Usa o repository para validar que o e-mail existe
    const usuarioExistente = await UsuarioRepository.findByEmail(email);
    if (usuarioExistente) {
      throw { status: 409, mensagem: "E-mail já está em uso" };
    }

    // Criptografa a senha a partir do bcrypt
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Definir o papel como admin ou cliente (se não for admin é automaticamente cliente)
    const role = papel === "admin" ? "admin" : "cliente";

    const novoUsuario = await UsuarioRepository.create({
      nome: nome.trim(),
      email: email.trim(),
      senha: senhaHash,
      papel: role,
    });

    return {
      sucesso: true,
      mensagem: "Usuário registrado com sucesso",
      id: novoUsuario,
    };
  }

  async login(email, senha) {
    if (!email || !senha) {
      throw { status: 400, mensagem: "E-mail e senha são obrigatórios" };
    }

    const usuario = await UsuarioRepository.findByEmail(email);
    if (!usuario) {
      throw { status: 401, mensagem: "Credencias inválidas" };
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw { status: 401, mensagem: "Credenciais inválidas" };
    }

    const token = jwt.sign(
      { id: usuario.id, papel: usuario.papel },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    return {
      sucesso: true,
      mensagem: "login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    };
  }

  async atualizarUsuario(email, dados) {
    if (!email) {
      throw { status: 400, mensagem: "E-mail inválido" };
    }

    const usuario = await UsuarioRepository.findByEmail(email);
    if (!usuario) {
      throw { status: 404, mensagem: "Usuário não encontrado" };
    }

    const atualizado = {};
    const { nome, email: novoEmail, senha, papel } = dados;

    if (nome !== undefined || nome.trim() !== "") atualizado.nome = nome.trim();
    if (
      novoEmail !== undefined ||
      novoEmail.trim() !== "" ||
      novoEmail !== email
    ) {
      const emailExistente = await UsuarioRepository.findByEmail(
        novoEmail.trim(),
      );
      if (emailExistente) {
        throw { status: 409, mensagem: "O novo e-mail já está em uso" };
      }
      atualizado.email = novoEmail.trim();
    }
    if (senha !== undefined || senha.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      atualizado.senha = await bcrypt.hash(senha, salt);
    }
    if (papel !== undefined) atualizado.papel = papel.trim();

    if (Object.keys(atualizado).length === 0) {
      throw {
        status: 400,
        mensagem: "Nenhum dado válido enviado para atualização",
      };
    }

    await UsuarioRepository.update(usuario.id, atualizado);

    return {
      sucesso: true,
      mensagem: "Usuário atualizado com sucesso",
    };
  }

  async deletarUsuario(id) {
    if (!id || isNaN(id)) {
      throw { status: 400, mensagem: "ID inválido" };
    }

    const existe = await UsuarioRepository.findById(id);
    if (!existe) {
      throw { status: 404, mensagem: "Usuário não encontrado" };
    }

    await UsuarioRepository.delete(id);

    return {
      sucesso: true,
      mensagem: "Usuário apagado com sucesso",
    };
  }
}

module.exports = new UsuarioService();
