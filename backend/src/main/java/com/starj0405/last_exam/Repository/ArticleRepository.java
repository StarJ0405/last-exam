package com.starj0405.last_exam.Repository;

import com.starj0405.last_exam.Entity.Article;
import com.starj0405.last_exam.Repository.Custom.ArticleRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long>, ArticleRepositoryCustom {
}
