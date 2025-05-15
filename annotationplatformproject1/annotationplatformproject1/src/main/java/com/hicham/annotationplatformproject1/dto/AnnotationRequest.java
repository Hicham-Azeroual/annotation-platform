package com.hicham.annotationplatformproject1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnnotationRequest {
    private Long annotateurId;
    private Long coupeTexteId;
    private Long classeChoisieId;

    public Long getCoupeTexteId() {
        return coupeTexteId;
    }

    public void setCoupeTexteId(Long coupeTexteId) {
        this.coupeTexteId = coupeTexteId;
    }

    public Long getClasseChoisieId() {
        return classeChoisieId;
    }

    public void setClasseChoisieId(Long classeChoisieId) {
        this.classeChoisieId = classeChoisieId;
    }

    public Long getAnnotateurId() {
        return annotateurId;
    }

    public void setAnnotateurId(Long annotateurId) {
        this.annotateurId = annotateurId;
    }
}