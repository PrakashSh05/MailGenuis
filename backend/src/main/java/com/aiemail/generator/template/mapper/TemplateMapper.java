package com.aiemail.generator.template.mapper;

import com.aiemail.generator.template.dto.TemplateRequest;
import com.aiemail.generator.template.dto.TemplateResponse;
import com.aiemail.generator.template.dto.TemplateSummaryResponse;
import com.aiemail.generator.template.entity.UserTemplateEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TemplateMapper {

    TemplateMapper INSTANCE = Mappers.getMapper(TemplateMapper.class);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    UserTemplateEntity templateRequestToUserTemplateEntity(TemplateRequest request);

    TemplateResponse userTemplateEntityToTemplateResponse(UserTemplateEntity entity);

    TemplateSummaryResponse userTemplateEntityToTemplateSummaryResponse(UserTemplateEntity entity);
}
