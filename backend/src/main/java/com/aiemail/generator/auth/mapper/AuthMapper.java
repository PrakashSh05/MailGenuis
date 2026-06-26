package com.aiemail.generator.auth.mapper;

import com.aiemail.generator.auth.dto.AuthResponse;
import com.aiemail.generator.auth.dto.RegisterRequest;
import com.aiemail.generator.auth.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    AuthMapper INSTANCE = Mappers.getMapper(AuthMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "profilePictureUrl", ignore = true)
    @Mapping(target = "defaultTone", ignore = true)
    @Mapping(target = "defaultLanguage", ignore = true)
    @Mapping(target = "defaultEmailLength", ignore = true)
    @Mapping(target = "darkModeEnabled", ignore = true)
    @Mapping(target = "themePreference", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "emails", ignore = true)
    @Mapping(target = "templates", ignore = true)
    UserEntity registerRequestToUserEntity(RegisterRequest request);

    @Mapping(target = "token", ignore = true)
    @Mapping(target = "expiresIn", ignore = true)
    AuthResponse userEntityToAuthResponse(UserEntity user);
}
