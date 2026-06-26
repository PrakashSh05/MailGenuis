package com.aiemail.generator.dashboard.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DashboardMapper {

    DashboardMapper INSTANCE = Mappers.getMapper(DashboardMapper.class);
}
