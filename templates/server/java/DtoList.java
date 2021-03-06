package <%=data.packageName%>.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class <%=data.moduleClassName%>sDto{
    List<<%=data.moduleClassName%>Dto> items;

}
