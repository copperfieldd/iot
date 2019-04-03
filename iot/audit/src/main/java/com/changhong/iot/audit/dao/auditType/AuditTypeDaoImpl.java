package com.changhong.iot.audit.dao.auditType;

import com.changhong.iot.audit.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.audit.constant.FieldConstant;
import com.changhong.iot.audit.entity.TAuditType;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AuditTypeDaoImpl extends BaseMongoDaoImpl<TAuditType> implements AuditTypeDao {
    @Override
    protected Class<TAuditType> getEntityClass() {
        return TAuditType.class;
    }

    @Override
    public List<TAuditType> findAllByNotDel() {
        List<TAuditType> list = findByProp(FieldConstant.DELETED_FLAG, false);
        return list;
    }

    @Override
    public Optional<TAuditType> findById(String id) {
        final List<TAuditType> list = findByProps(new String[]{"id", FieldConstant.DELETED_FLAG}, new Object[]{id, false});
        if (list.size() == 1 ) {
            return Optional.of(list.get(0));
        }
        return Optional.empty();
    }
}
