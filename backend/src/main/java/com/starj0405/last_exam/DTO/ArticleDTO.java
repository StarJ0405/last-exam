package com.starj0405.last_exam.DTO;

import lombok.Builder;

@Builder
public record ArticleDTO(long id, String title, String content) {
}
