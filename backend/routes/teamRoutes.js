const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// ==================== ROTAS DE ESTUDANTES (PRIMEIRO!) ====================
// ⚠️ IMPORTANTE: Esta rota DEVE vir ANTES de "/:id" senão "students" é interpretado como um ID
router.get("/students", teamController.getStudents);

// ==================== ROTAS DE TAREFAS ====================
// Buscar tarefas de uma equipa
router.get("/tasks/:teamId", teamController.getTasksByTeam);

// Marcar/desmarcar tarefa como completa
router.post("/tasks/:taskId/complete", teamController.toggleTask);

// ==================== ROTAS DE EQUIPAS ====================
// Listar todas as equipas
router.get("/", teamController.getTeams);

// Criar nova equipa
router.post("/create", teamController.createTeam);

// ==================== ROTAS DE MEMBROS ====================
// Buscar membros de uma equipa específica
router.get("/:teamId/members", teamController.getTeamMembers);

// Adicionar membro a uma equipa
router.post("/members/add", teamController.addTeamMember);

// Remover membro de uma equipa
router.delete("/members/remove", teamController.removeTeamMember);

// Atualizar role de um membro
router.put("/members/role", teamController.updateTeamMemberRole);

// ==================== APAGAR EQUIPA (ÚLTIMO!) ====================
// ⚠️ Esta rota deve vir por último para não capturar outras rotas
router.delete("/:id", teamController.deleteTeam);

module.exports = router;