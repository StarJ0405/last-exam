package com.starj0405.last_exam.Repository.Custom.Impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.starj0405.last_exam.Entity.Article;
import com.starj0405.last_exam.Entity.QArticle;
import com.starj0405.last_exam.Repository.Custom.ArticleRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
public class ArticleRepositoryCustomImpl implements ArticleRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    QArticle qArticle = QArticle.article;

    @Override
    public Page<Article> getList(Pageable pageable) {
        List<Article> content = jpaQueryFactory.selectFrom(qArticle).offset(pageable.getOffset()).limit(pageable.getPageSize()).fetch();
        Long total = jpaQueryFactory.select(qArticle.count()).from(qArticle).fetchOne();
        if(total == null)
            total=0L;
        return new PageImpl<>(content, pageable,total);
    }
}
