package onehajo.seurasaeng.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import jakarta.validation.constraints.NotNull;


@Entity
@Getter
@Builder
@AllArgsConstructor
@Table(name = "users", schema = "seurasaeng_test")
public class User {

    @Id
    // Auto Increment
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "user_id")
    private Long id;

    @NotNull
    @Column(name = "user_name", columnDefinition = "varchar(10)")
    @NotBlank(message = "이름은 필수 입력 값입니다.")
    private String name;

    @Email
    @NotNull
    @Column(name = "user_email", columnDefinition = "varchar(50)")
    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    private String email;

    @NotNull
    @Column(name = "user_password", columnDefinition = "varchar(50)")
    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    private String password;

    @Column(name = "user_image", columnDefinition = "TEXT")
    private String image;

    @NotNull
    @Column(name = "user_read_newnoti", columnDefinition = "boolean default false")
    private boolean read_newnoti;

    // 생성자
    public User() {}
}
