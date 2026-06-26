package com.aiemail.generator.email.mapper;

import com.aiemail.generator.email.dto.EmailResponse;
import com.aiemail.generator.email.dto.EmailSummaryResponse;
import com.aiemail.generator.email.dto.SaveEmailRequest;
import com.aiemail.generator.email.entity.EmailEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface EmailMapper {

    EmailMapper INSTANCE = Mappers.getMapper(EmailMapper.class);

    EmailEntity saveEmailRequestToEmailEntity(SaveEmailRequest request);

    EmailResponse emailEntityToEmailResponse(EmailEntity entity);

    EmailSummaryResponse emailEntityToEmailSummaryResponse(EmailEntity entity);
}
