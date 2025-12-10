package devapp.upt.api.services;

import devapp.upt.*;
import org.springframework.stereotype.Service;

@Service
public class TeamService {

    private Edu_TeamMember.Role convertRole(String role) {
        if (role == null) return null;

        return switch (role.trim().toUpperCase()) {
            case "SCRUM MASTER", "SCRUM_MASTER" -> Edu_TeamMember.Role.SCRUM_MASTER;
            case "PRODUCT OWNER", "PRODUCT_OWNER" -> Edu_TeamMember.Role.PRODUCT_OWNER;
            case "DEVELOPER" -> Edu_TeamMember.Role.DEVELOPER;
            default -> throw new IllegalArgumentException("Unknown role: " + role);
        };
    }

    public void addMember(Edu_Team team, Edu_Student student, String roleString) {
        Edu_TeamMember.Role roleEnum = convertRole(roleString);
        team.addMember(student, roleEnum);
    }

    public Edu_Team findTeam(Edu_Project project, String teamName) {
        if (project == null || teamName == null) return null;
        return project.getTeams().stream()
                .filter(t -> t.getName().equalsIgnoreCase(teamName))
                .findFirst()
                .orElse(null);
    }

    public Edu_Team createTeam(Edu_Project project, String teamName) {
        if (project == null || teamName == null || teamName.trim().isEmpty()) {
            throw new IllegalArgumentException("Project and team name cannot be null or empty");
        }
        Edu_Team team = new Edu_Team(teamName, project);
        project.addTeam(team);
        return team;
    }
}