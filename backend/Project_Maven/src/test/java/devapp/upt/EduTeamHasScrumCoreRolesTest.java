package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class EduTeamHasScrumCoreRolesTest {

    @Test
    void shouldReturnFalseWhenNoMembersExist() {
        // Arrange
        Edu_Team team = new Edu_Team("Alpha");

        // Act
        boolean result = team.hasScrumCoreRoles();

        // Assert
        assertFalse(result, "Team with no members cannot satisfy Scrum roles");
    }

    @Test
    void shouldReturnFalseWhenRolesAreMissing() {
        // Arrange
        Edu_Team team = new Edu_Team("Alpha");
        Edu_Student s1 = new Edu_Student();

        // Only one role assigned
        team.addMember(s1, Edu_TeamMember.Role.SCRUM_MASTER);

        // Act
        boolean result = team.hasScrumCoreRoles();

        // Assert
        assertFalse(result, "Team missing Product Owner and Developer must return false");
    }

    @Test
    void shouldIgnoreMembersWithNullRole() {
        // Arrange
        Edu_Team team = new Edu_Team("Alpha");
        Edu_Student s1 = new Edu_Student();
        Edu_Student s2 = new Edu_Student();

        team.addMember(s1, null);               // should be ignored
        team.addMember(s2, Edu_TeamMember.Role.SCRUM_MASTER);     // only one valid role

        // Act
        boolean result = team.hasScrumCoreRoles();

        // Assert
        assertFalse(result, "Null roles must be ignored and only valid roles counted");
    }

    @Test
    void shouldReturnTrueWhenAllCoreRolesArePresent() {
        // Arrange
        Edu_Team team = new Edu_Team("Alpha");

        Edu_Student sm = new Edu_Student();
        Edu_Student po = new Edu_Student();
        Edu_Student dev = new Edu_Student();

        team.addMember(sm, Edu_TeamMember.Role.SCRUM_MASTER);
        team.addMember(po, Edu_TeamMember.Role.PRODUCT_OWNER);
        team.addMember(dev, Edu_TeamMember.Role.DEVELOPER);

        // Act
        boolean result = team.hasScrumCoreRoles();

        // Assert
        assertTrue(result, "Team must satisfy Scrum Master + Product Owner + Developer to return true");
    }

    @Test
    void shouldAllowMultipleMembersWithSameRole() {
        // Arrange
        Edu_Team team = new Edu_Team("Alpha");

        Edu_Student sm = new Edu_Student();
        Edu_Student po = new Edu_Student();
        Edu_Student dev1 = new Edu_Student();
        Edu_Student dev2 = new Edu_Student();

        team.addMember(sm, Edu_TeamMember.Role.SCRUM_MASTER);
        team.addMember(po, Edu_TeamMember.Role.PRODUCT_OWNER);
        team.addMember(dev1, Edu_TeamMember.Role.DEVELOPER);
        team.addMember(dev2, Edu_TeamMember.Role.DEVELOPER);

        // Act
        boolean result = team.hasScrumCoreRoles();

        // Assert
        assertTrue(result, "Multiple developers should still satisfy core roles");
    }

    @Test
    void hasScrumCoreRolesShouldReturnFalseWhenRolesAreMissing() {
        // Arrange
        Edu_Team team = new Edu_Team("Alpha");
        Edu_Student s1 = new Edu_Student();

        // Only one role
        team.addMember(s1, Edu_TeamMember.Role.SCRUM_MASTER);

        // Act
        boolean result = team.hasScrumCoreRoles();

        // Assert
        assertFalse(result, "Should be false when not all core roles are present");
    }

    @Test
    void hasScrumCoreRolesShouldReturnTrueWhenAllCoreRolesPresent() {
        // Arrange
        Edu_Team team = new Edu_Team("Alpha");

        Edu_Student sm = new Edu_Student();
        Edu_Student po = new Edu_Student();
        Edu_Student dev = new Edu_Student();

        team.addMember(sm, Edu_TeamMember.Role.SCRUM_MASTER);
        team.addMember(po, Edu_TeamMember.Role.PRODUCT_OWNER);
        team.addMember(dev, Edu_TeamMember.Role.DEVELOPER);

        // Act
        boolean result = team.hasScrumCoreRoles();

        // Assert
        assertTrue(result, "Should be true when Scrum Master, Product Owner and Developer exist");
    }
}
