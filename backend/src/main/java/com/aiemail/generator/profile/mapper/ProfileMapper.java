package com.aiemail.generator.profile.mapper;

import com.aiemail.generator.auth.entity.UserEntity;
import com.aiemail.generator.profile.dto.ProfileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    ProfileMapper INSTANCE = Mappers.getMapper(ProfileMapper.class);

    ProfileResponse userEntityToProfileResponse(UserEntity entity);
}
