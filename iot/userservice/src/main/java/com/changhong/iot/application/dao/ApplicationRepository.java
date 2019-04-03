package com.changhong.iot.application.dao;

import com.changhong.iot.application.entity.ApplicationEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ApplicationRepository extends MongoRepository<ApplicationEntity, String> {
}
