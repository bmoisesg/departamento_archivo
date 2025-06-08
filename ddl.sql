create table tipo (
	id_tipo  int IDENTITY(1,1) primary key,
	titulo varchar (100)
); 

create table archivo (
	id_archivo int IDENTITY(1,1) primary key,
	titulo varchar (100), 
	id_tipo int, 
	fiscal_ingreso bigint,
	foreign  key(id_tipo)references tipo(id_tipo), 
) ;

create table estado_archivo(
	id_estado int IDENTITY(1,1) primary key, 
	titulo varchar(100) ,
	descripcion varchar (200)
);

create table historial(
	id_historial int IDENTITY(1,1) primary key, 
	id_archivo int, 
	id_estado int, 
	fecha datetime , 
	motivo varchar(200),
	foreign key (id_archivo) references archivo(id_archivo), 
	foreign key (id_estado) references estado_archivo(id_estado),
);

insert into tipo(titulo) values 
('Fisico'), 
('Virtual');

insert into estado_archivo(titulo, descripcion ) values
('Ingresado','cuando se registra'),
('Prestado','alquien lo tiene'),
('Egresado','cuando se elimina');



select * from tipo;
select * from estado_archivo;
select * from archivo; 
select * from historial;

/*********************************** listar tipos *******************************************************/
CREATE PROCEDURE sp_GetTipo
AS
BEGIN
    SELECT * FROM tipo;
END;

EXEC sp_GetTipo;


/*********************************** insertar archivo *******************************************************/

CREATE PROCEDURE sp_InsertArchivo
@titulo nvarchar(100), 
@tipo int, 
@fiscal_ingreso nvarchar(15)
AS
BEGIN
	insert into archivo(titulo, id_tipo, fiscal_ingreso)  values( @titulo, @tipo, @fiscal_ingreso);
	
	DECLARE @archivoGuardado INT = SCOPE_IDENTITY();	

	insert into historial(id_archivo, id_estado, fecha, motivo)  
	values( @archivoGuardado , 1, getdate(), 'Ingreso de archivo');

	select * from archivo;

END;

EXEC sp_InsertArchivo 'archivo', 1, '12312312310101'

/*********************************** insertar historial *******************************************************/

CREATE PROCEDURE sp_InsertHistorial
@id_archivo int, 
@id_estado int, 
@motivo varchar (200)
AS
BEGIN
	insert into historial(id_archivo, id_estado, fecha, motivo)  values( @id_archivo, @id_estado, getdate(), @motivo);
	select * from historial;
END;

EXEC sp_InsertHistorial 1,2,'una persona lo solicita'


/*********************************** listar archivos *******************************************************/
CREATE PROCEDURE sp_GetArchivos
AS
BEGIN
    SELECT a.id_archivo, a.titulo, b.titulo as tipoArchivo, a.fiscal_ingreso
	FROM archivo a
	inner join tipo b on b.id_tipo= a.id_tipo
	;
END;

EXEC sp_GetArchivos;


/*********************************** listar estados *******************************************************/
CREATE PROCEDURE sp_GetEstados
AS
BEGIN
    SELECT * FROM estado_archivo;
END;

EXEC sp_GetEstados;


/*********************************** historial de un archivo  *******************************************************/
CREATE PROCEDURE sp_historialArchivo
@id_archivo int
AS
BEGIN
    SELECT a.id_historial, a.id_archivo, b.titulo as id_estado, a.fecha, a.motivo 
	FROM historial a
	inner join estado_archivo b on b.id_estado = a.id_estado  
	where id_archivo= @id_archivo 
	;
END;

EXEC sp_historialArchivo 1;


/*********************************** estado actual de un archivo  *******************************************************/
CREATE PROCEDURE sp_estadoActualArchivo
@id_archivo int
AS
BEGIN
    SELECT Top(1) b.titulo , b.id_estado
	FROM historial a
	inner join estado_archivo b on b.id_estado = a.id_estado
	where id_archivo= @id_archivo
	order by fecha desc
END;

exec sp_estadoActualArchivo 2; 

/*********************************** reporte1 *******************************************************/
CREATE PROCEDURE sp_reporte1
AS
BEGIN
	select h.id_archivo , a.titulo, count (*) contador 
	from historial h
	inner join archivo a on a.id_archivo = h.id_archivo
	group by h.id_archivo,a.titulo
	order by contador desc
END;

EXEC sp_reporte1;



/*********************************** reporte2 *******************************************************/
CREATE PROCEDURE sp_reporte2
AS
BEGIN
	SELECT estado_archivo.titulo, COUNT(*) AS cantidad
	FROM (
		SELECT *
		FROM historial t
		WHERE fecha = (
			SELECT MAX(fecha)
			FROM historial
			WHERE id_archivo = t.id_archivo
		)
	) AS ultimos
	inner join estado_archivo on estado_archivo.id_estado= ultimos.id_estado
	GROUP BY estado_archivo.titulo
	ORDER BY cantidad DESC;
END;

EXEC sp_reporte2;



