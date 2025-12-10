package devapp.upt.api.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import devapp.upt.Edu_Awards;
import devapp.upt.Edu_AwardsAssigment;
import devapp.upt.api.dto.AwardAssignAutomaticDTO;
import devapp.upt.api.dto.AwardAssignStudentDTO;
import devapp.upt.api.dto.AwardAssignTeamDTO;
import devapp.upt.api.dto.AwardAssignmentResponse;
import devapp.upt.api.dto.AwardCreateDTO;
import devapp.upt.api.dto.AwardResponse;
import devapp.upt.api.services.AwardService;

@RestController
@RequestMapping("/api/awards")
public class AwardController {

    private final AwardService awards;

    public AwardController(AwardService awards) {
        this.awards = awards;
    }

    @PostMapping
    public ResponseEntity<?> createAward(@RequestBody AwardCreateDTO dto) {
        try {
            Edu_Awards a = awards.createAward(
                    dto.teacherEmail,
                    dto.name,
                    dto.description,
                    dto.points,
                    dto.type,
                    dto.triggerCondition
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(new AwardResponse(a));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public List<AwardResponse> listAwards() {
        return awards.listAwards().stream()
                .map(AwardResponse::new)
                .collect(Collectors.toList());
    }

    // ------------------------------------------------------------
    // 1 → Assign award to student
    // ------------------------------------------------------------
    @PostMapping("/assign/student")
    public ResponseEntity<?> assignToStudent(@RequestBody AwardAssignStudentDTO dto) {
        try {
            Edu_AwardsAssigment a = awards.assignToStudent(
                    dto.teacherEmail, dto.studentEmail, dto.awardName, dto.reason
            );
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new AwardAssignmentResponse(a));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ------------------------------------------------------------
    // 2 → Assign award to team
    // ------------------------------------------------------------
    @PostMapping("/assign/team")
    public ResponseEntity<?> assignToTeam(@RequestBody AwardAssignTeamDTO dto) {
        try {
            Edu_AwardsAssigment a = awards.assignToTeam(
                    dto.teacherEmail, dto.projectName, dto.teamName, dto.awardName, dto.reason
            );
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new AwardAssignmentResponse(a));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ------------------------------------------------------------
    // 3 → Automatic assignments
    // ------------------------------------------------------------
    @PostMapping("/assign/automatic")
    public ResponseEntity<?> assignAutomatic(@RequestBody AwardAssignAutomaticDTO dto) {
        try {
            List<Edu_AwardsAssigment> list = awards.assignAutomatic(
                    dto.teacherEmail, dto.courseName, dto.awardName, dto.minScore
            );

            return ResponseEntity.ok(
                list.stream()
                    .map(AwardAssignmentResponse::new)
                    .collect(Collectors.toList())
            );

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}