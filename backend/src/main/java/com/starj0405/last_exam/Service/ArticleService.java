package com.starj0405.last_exam.Service;

import com.starj0405.last_exam.DTO.ArticleDTO;
import com.starj0405.last_exam.Entity.Article;
import com.starj0405.last_exam.Repository.ArticleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;

    @Transactional
    public String createArticle(ArticleDTO dto) {
        Article article = Article.builder().title(dto.title()).content(dto.content()).build();
        articleRepository.save(article);
        return "created";
    }

    public Page<ArticleDTO> getList(int page) {
        return articleRepository.getList(PageRequest.of(page, 10)).map(this::transform);
    }

    @Transactional
    public String updateArticle(ArticleDTO dto) {
        Optional<Article> _article = articleRepository.findById(dto.id());
        _article.ifPresent(article -> {
            article.setTitle(dto.title());
            article.setContent(dto.content());
            articleRepository.save(article);
        });
        return "updated";
    }

    @Transactional
    public String deleteArticle(long id) {
        Optional<Article> _article = articleRepository.findById(id);
        _article.ifPresent(articleRepository::delete);
        return "deleted";
    }


    private ArticleDTO transform(Article article) {
        return ArticleDTO.builder().id(article.getId()).title(article.getTitle()).content(article.getContent()).build();
    }
}
