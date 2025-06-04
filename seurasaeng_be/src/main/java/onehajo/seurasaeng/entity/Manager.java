package onehajo.seurasaeng.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;


@Entity
@Getter
@Builder
@AllArgsConstructor
@Table(name = "manager", schema = "seurasaeng_test")
public class Manager {

    @Id
    // Auto Increment
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "manager_id")
    private Long id;

    @Email
    @NotNull
    @Column(name = "manager_email", columnDefinition = "varchar(50)")
    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    private String email;

    @NotNull
    @Column(name = "manager_password", columnDefinition = "varchar(50)")
    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    private String password;

    // 생성자
    public Manager() {}
}
