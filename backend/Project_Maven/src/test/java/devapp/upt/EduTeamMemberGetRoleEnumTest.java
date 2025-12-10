package devapp.upt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

public class EduTeamMemberGetRoleEnumTest {

    @Test
    void shouldReturnNullWhenRoleIsNull() {
        Edu_Team team = new Edu_Team("Team");
        Edu_Student student = new Edu_Student();

        Edu_TeamMember member = new Edu_TeamMember(team, student, (String) null);

        assertNull(member.getRoleEnum(),
                "Quando o role é null, getRoleEnum deve devolver null");
    }

    @Test
    void shouldReturnEnumWhenRoleMatchesEnumNameExactly() {
        Edu_Team team = new Edu_Team("Team");
        Edu_Student student = new Edu_Student();

        // Usar o nome EXACTO do enum
        Edu_TeamMember member = new Edu_TeamMember(team, student, "SCRUM_MASTER");

        assertEquals(Edu_TeamMember.Role.SCRUM_MASTER, member.getRoleEnum(),
                "Deve mapear o nome exacto do enum para Role.SCRUM_MASTER");
    }

    @Test
    void shouldMapLegacyStringScrumMaster() {
        Edu_Team team = new Edu_Team("Team");
        Edu_Student student = new Edu_Student();

        // String legacy – entra no catch e faz contains("scrum master")
        Edu_TeamMember member = new Edu_TeamMember(team, student, "Scrum Master");

        assertEquals(Edu_TeamMember.Role.SCRUM_MASTER, member.getRoleEnum(),
                "String 'Scrum Master' deve mapear para Role.SCRUM_MASTER");
    }

    @Test
    void shouldMapLegacyStringProductOwner() {
        Edu_Team team = new Edu_Team("Team");
        Edu_Student student = new Edu_Student();

        Edu_TeamMember member = new Edu_TeamMember(team, student, "Product Owner");

        assertEquals(Edu_TeamMember.Role.PRODUCT_OWNER, member.getRoleEnum(),
                "String 'Product Owner' deve mapear para Role.PRODUCT_OWNER");
    }

    @Test
    void shouldMapLegacyStringDeveloper() {
        Edu_Team team = new Edu_Team("Team");
        Edu_Student student = new Edu_Student();

        Edu_TeamMember member = new Edu_TeamMember(team, student, "Senior Developer");

        assertEquals(Edu_TeamMember.Role.DEVELOPER, member.getRoleEnum(),
                "Strings que contenham 'developer' devem mapear para Role.DEVELOPER");
    }

    @Test
    void shouldReturnNullForUnknownRoleString() {
        Edu_Team team = new Edu_Team("Team");
        Edu_Student student = new Edu_Student();

        Edu_TeamMember member = new Edu_TeamMember(team, student, "QA Lead");

        assertNull(member.getRoleEnum(),
                "Roles que não correspondem a nenhum dos casos devem devolver null");
    }
}