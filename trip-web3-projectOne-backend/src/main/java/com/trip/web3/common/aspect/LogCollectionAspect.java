package com.trip.web3.common.aspect;

import com.trip.web3.common.annotation.LogCollection;
import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LogCollectionAspect {

    private static Logger log = Logger.getLogger(LogCollectionAspect.class);

    @Around("@annotation(logCollection)")
    public <T> T around(ProceedingJoinPoint joinPoint, LogCollection logCollection) throws Throwable {

        String methodName = joinPoint.getSignature().getName();
        log.info(methodName + " begin ====================");
        T proceed = null;
        try{
            proceed = (T)joinPoint.proceed();
        }catch (Exception e){
            log.error(e.getMessage());
        }
        log.info(methodName + " end ==================== ");
        return proceed;
    }
}
