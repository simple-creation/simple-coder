package <%=data.packageName%>.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class <%=data.moduleClassName%>NewDto{
    <%for (var field in data.moduleDefine){
        var fieldDataType = data.moduleDefine[field];
        var fieldName     = field;         
        if ((field =='id')||(field=='_id')){ %> 
    <%}else{ %>
    private <%=fieldDataType%> <%=field%>;
    
    <%}}%>
 
}
