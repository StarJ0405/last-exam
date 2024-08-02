package com.starj0405.last_exam.Controller;

import com.starj0405.last_exam.DTO.ArticleDTO;
import com.starj0405.last_exam.Service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/article")
public class ArticleController {
    private final ArticleService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ArticleDTO dto) {
        return ResponseEntity.status(HttpStatus.OK).body(service.createArticle(dto));
    }

    @GetMapping
    public ResponseEntity<?> getList(@RequestHeader("Page") int page) {
        return ResponseEntity.status(HttpStatus.OK).body(service.getList(page));
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody ArticleDTO dto) {
        return ResponseEntity.status(HttpStatus.OK).body(service.updateArticle(dto));
    }

    @DeleteMapping
    public ResponseEntity<?> delete(@RequestHeader("Id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(service.deleteArticle(id));
    }
}
