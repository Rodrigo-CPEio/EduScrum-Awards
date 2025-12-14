// backend/controllers/projectController.js
const Project = require("../models/projectModel");

exports.createProject = (req, res) => {
  const { name, description, startDate, endDate, disciplineId } = req.body;
  
  if (!name || !description || !startDate || !endDate || !disciplineId) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }
  
  Project.create({ name, description, startDate, endDate, disciplineId }, (err, result) => {
    if (err) {
      console.error("Erro ao criar projeto:", err);
      return res.status(500).json({ message: "Erro ao criar projeto" });
    }
    res.status(201).json({ message: "Projeto criado com sucesso", projectId: result.insertId });
  });
};

exports.getProjects = (req, res) => {
  Project.getProjects((err, rows) => {
    if (err) {
      console.error("Erro ao buscar projetos:", err);
      return res.status(500).json({ message: "Erro ao buscar projetos" });
    }
    res.json(rows);
  });
};

exports.getMyProjects = (req, res) => {
  const studentId = Number(req.query.studentId);
  
  if (!studentId) {
    return res.status(400).json({ message: "studentId é obrigatório" });
  }
  
  Project.getMyProjects(studentId, (err, rows) => {
    if (err) {
      console.error("Erro ao buscar projetos do estudante:", err);
      return res.status(500).json({ message: "Erro ao buscar projetos do estudante" });
    }
    res.json(rows);
  });
};

exports.getProjectsByDiscipline = (req, res) => {
  const { disciplineId } = req.params;
  
  Project.findByDiscipline(disciplineId, (err, projects) => {
    if (err) {
      console.error("Erro ao buscar projetos:", err);
      return res.status(500).json({ message: "Erro ao buscar projetos" });
    }
    res.json(projects);
  });
};

exports.getProjectsByTeacher = (req, res) => {
  const { teacherId } = req.params;
  
  Project.findByTeacher(teacherId, (err, projects) => {
    if (err) {
      console.error("Erro ao buscar projetos:", err);
      return res.status(500).json({ message: "Erro ao buscar projetos" });
    }
    res.json(projects);
  });
};

exports.getProjectById = (req, res) => {
  const { projectId } = req.params;
  
  Project.findById(projectId, (err, rows) => {
    if (err) {
      console.error("Erro ao buscar projeto:", err);
      return res.status(500).json({ message: "Erro ao buscar projeto" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    res.json(rows[0]);
  });
};

exports.updateProject = (req, res) => {
  const { projectId } = req.params;
  const { name, description, startDate, endDate, status } = req.body;
  
  if (!name || !description || !startDate || !endDate) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }
  
  Project.update(projectId, { name, description, startDate, endDate, status: status || "ativo" }, (err, result) => {
    if (err) {
      console.error("Erro ao atualizar projeto:", err);
      return res.status(500).json({ message: "Erro ao atualizar projeto" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    res.json({ message: "Projeto atualizado com sucesso" });
  });
};

// ✅ DELETAR PROJETO COM CASCATA COMPLETA (apaga tudo em ordem)
exports.deleteProject = (req, res) => {
  const { projectId } = req.params;
  
  // ORDEM DE DELEÇÃO (do mais dependente ao menos dependente):
  // 1. Tasks das equipas
  // 2. Membros das equipas  
  // 3. Equipas
  // 4. Sprints
  // 5. Projeto
  
  // 1. Deletar tasks
  Project.deleteTasksByProject(projectId, (err) => {
    if (err) {
      console.error("Erro ao deletar tasks:", err);
      return res.status(500).json({ message: "Erro ao deletar tasks do projeto" });
    }
    
    // 2. Deletar membros das equipas
    Project.deleteTeamMembersByProject(projectId, (err) => {
      if (err) {
        console.error("Erro ao deletar membros das equipas:", err);
        return res.status(500).json({ message: "Erro ao deletar membros das equipas" });
      }
      
      // 3. Deletar equipas
      Project.deleteTeamsByProject(projectId, (err) => {
        if (err) {
          console.error("Erro ao deletar equipas:", err);
          return res.status(500).json({ message: "Erro ao deletar equipas do projeto" });
        }
        
        // 4. Deletar sprints
        Project.deleteSprintsByProject(projectId, (err) => {
          if (err) {
            console.error("Erro ao deletar sprints:", err);
            return res.status(500).json({ message: "Erro ao deletar sprints do projeto" });
          }
          
          // 5. Finalmente, deletar o projeto
          Project.delete(projectId, (err, result) => {
            if (err) {
              console.error("Erro ao deletar projeto:", err);
              return res.status(500).json({ message: "Erro ao deletar projeto", error: err.message });
            }
            if (result.affectedRows === 0) {
              return res.status(404).json({ message: "Projeto não encontrado" });
            }
            res.json({ message: "Projeto deletado com sucesso (incluindo equipas, membros, tasks e sprints)" });
          });
        });
      });
    });
  });
};