package <%=data.packageName%>.entity;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.*;

import java.util.List;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
public class <%=data.moduleName%> implements Serializable {
	private static final long serialVersionUID = 1L;

    <%
    var  columns = [];
    for (var field in data.moduleDefine){
           var fieldDef = data.moduleDefine[field];
           var keyName     = field;
           var displayName = fieldDef.dName;
           var type        = fieldDef.type;
           var refer       = fieldDef.refer;
           if ((field =='id')||(field=='_id')){%>
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private <%=type%> <%=keyName%>;
          <% } else if (refer){
            var referModule = data.firstUpper(refer.module);
            var relation = refer.map;
            if (refer.map=="ManyToMany"){%>

    @JoinTable(name = "<%-data.moduleName%><%-referModule%>", joinColumns = { @JoinColumn(name = "<%-data.moduleName%>_id") }, inverseJoinColumns = {
    			@JoinColumn(name = "<%-refer.module%>_id") })
    @<%-relation%>(cascade = { CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.EAGER)
    private List<<%-referModule%>> <%-refer.module%>List;
    <%}else{%>
    @JoinColumn(name = "<%-refer.module%>_id") // 关联表的字段
    @<%-relation%>(cascade = { CascadeType.MERGE, CascadeType.REFRESH }, fetch = FetchType.EAGER)
    private <%-referModule%> <%=field%>;
    <%}%>

      <%}else{%>
    //<%-displayName%>
    private <%=type%> <%=keyName%>;
      <%}}%>
     public <%=data.moduleName%>() {
	 }
     <%
       for (var field in data.moduleDefine){
           var fieldDef = data.moduleDefine[field];
           var keyName     = data.firstUpper(field);
           var displayName = fieldDef.dName;
           var type        = fieldDef.type;
           var refer       = fieldDef.refer;
           if (refer){
               type=data.firstUpper(refer.module);
                if (refer.map=="ManyToMany"){%>

    public List<<%=type%>> get<%=type%>List(){
         return this.<%=refer.module%>List;
    };
    public void set<%=type%>List(List<<%=type%>> list){
         this.<%=refer.module%>List = list;
    }
                <%}else{%>

    public <%=type%> get<%=keyName%>(){
         return this.<%=field%>;
    };
    public void set<%=keyName%>(<%=type%> <%=field%>){
         this.<%=field%> = <%=field%>;
    }
                <%}
          }else {%>
     //<%-displayName%>
     public <%=type%> get<%=keyName%>(){
         return this.<%=field%>;
     };
     public void set<%=keyName%>(<%=type%> <%=field%>){
         this.<%=field%> = <%=field%>;
     }
     <%}}%>



	@Override
	public String toString() {
		return "CLASS DATA: [id=" + id + ", name=" + name + "]";
	}
}
