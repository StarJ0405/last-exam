package com.starj0405.last_exam.Repository.Custom;

import com.starj0405.last_exam.Entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArticleRepositoryCustom {
    Page<Article> getList(Pageable pageable);
}
