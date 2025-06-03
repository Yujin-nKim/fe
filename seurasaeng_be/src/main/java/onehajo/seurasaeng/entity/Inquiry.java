package onehajo.seurasaeng.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.spi.LocaleNameProvider;


@Entity
@Getter
@Builder
@AllArgsConstructor
@Table(name = "inquiry", schema = "seurasaeng_test")
public class Inquiry {

    @Id
    // Auto Increment
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "inquiry_id")
    private Long id;

    // 외래키 user_id
    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @Column(name = "inquiry_title", columnDefinition = "varchar(50)")
    @NotBlank(message = "문의 제목은 필수 입력 값입니다.")
    private String title;

    @Lob
    @Column(name = "inquiry_content", columnDefinition = "TEXT")
    private String content;

    @NotNull
    @Column(name = "inquiry_created_at", columnDefinition = "timestamp")
    private LocalDate created_at;

    @NotNull
    @Column(name = "inquiry_updated_at", columnDefinition = "timestamp")
    private LocalDate updated_at;

    @NotNull
    @Column(name = "inquiry_answer_status", columnDefinition = "boolean default false")
    private boolean answer_status;

    // 생성자
    public Inquiry() {}
}
