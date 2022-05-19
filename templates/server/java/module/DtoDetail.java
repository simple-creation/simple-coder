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
public class <%=data.moduleClassName%>DetailDto{
    <% for (var field in data.moduleDefine){
        var fieldDataType = data.moduleDefine[field];%>    
    private <%=fieldDataType%> <%=field%>;
    <%}%>
 
}
