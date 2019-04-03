package com.changhong.iot.audit.mongotest.dao;

import com.changhong.iot.audit.mongotest.entity.SampleEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.changhong.iot.audit.mongotest.entity.SampleEntity;

public interface MongoDao extends MongoRepository<SampleEntity, Integer>{
	
}
