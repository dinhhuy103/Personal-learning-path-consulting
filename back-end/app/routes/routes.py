from flask import request, Response, current_app
from flask_restx import Resource, Api
import json
from app.models import create_account_model
from app.models import create_register_model
from app.models import selected_items_model


def register_routes(api: Api):
    account_model = create_account_model(api)
    register_model = create_register_model(api)
    items_model = selected_items_model(api)
    

    @api.route('/career')
    class GetCareer(Resource):
        def get(self):
            # Access neo4j_driver within the request context
            driver = current_app.neo4j_driver
            with driver.session() as session:
                result = session.run("MATCH(n:Career) RETURN n")
                records = [record['n'] for record in result]  # Extract Node objects from the result
                data = [dict(node) for node in records]  # Convert Node objects to dictionaries
                json_data = json.dumps(data, ensure_ascii=False, indent=4)  # Serialize to JSON
                return Response(json_data, content_type="application/json; charset=utf-8")

    @api.route('/get_need_skill/<career_id>')
    class GetNeedSkill(Resource):
        def get(self, career_id):
            driver = current_app.neo4j_driver
            with driver.session() as session:
                query = """
                    MATCH (c:Career {Career_ID: $career_id})
                    OPTIONAL MATCH (c) - [:NEED_TOOL] -> (t:Tool)
                    OPTIONAL MATCH (c) - [:NEED_SOFTSKILL] -> (s:Soft_Skill)
                    OPTIONAL MATCH (c) - [:NEED_KNOWLEDGE] -> (k:Knowledge)
                    OPTIONAL MATCH (c) - [:NEED_LANGUAGE] -> (l:Language)
                    RETURN COLLECT (DISTINCT t.Tool_Name) AS tools,
                        COLLECT (DISTINCT s.Soft_Skill_Name) AS soft_skills,
                        COLLECT (DISTINCT k.Knowledge_Name) AS knowledges,
                        COLLECT (DISTINCT l.Language_Name) AS languages
                """

                result = session.run(query, career_id=career_id)
                record = result.single()

            if record:
                tools = record['tools']
                soft_skills = record['soft_skills']
                knowledges = record['knowledges']
                languages = record['languages']

                return ({
                    "tools": tools,
                    "soft_skills": soft_skills,
                    "knowledges": knowledges,
                    "languages": languages
                }), 200
            else:
                return ({"message": "Không tìm thấy thông tin cho người dùng này"}), 404

    @api.route('/get_learning_path/<career_id>')
    class GetLearningPath(Resource):
        def get(self, career_id):
            remove_vis_node_query = f"""
                    MATCH(n:VIS_{career_id})
                    REMOVE n:VIS_{career_id}
                    RETURN n
                """

            create_main_graph_query = """
                CALL gds.graph.exists('mainGraph')
                YIELD exists
                WITH exists
                CALL apoc.do.when(
                exists,
                'CALL gds.graph.drop("mainGraph") YIELD graphName RETURN graphName',
                'RETURN null AS graphName'
                ) YIELD value
                WITH value.graphName AS droppedgraphName

                CALL gds.graph.project('mainGraph',
                    ['Career', 'Tool', 'Soft_Skill', 'Knowledge', 'Language', 'Course', 'Learner'], 
                    ['NEED_TOOL', 'NEED_SOFTSKILL', 'NEED_KNOWLEDGE', 'NEED_LANGUAGE', 'TAUGHT_BY_COURSE', 'REQUIRE_TOOL', 'REQUIRE_SOFT_SKILL', 'REQUIRE_KNOWLEDGE', 'REQUIRE_LANGUAGE', 'WANT_TO_LEARN', 'HAS_KNOW']
                ) YIELD graphName, nodeCount, relationshipCount

                RETURN graphName, nodeCount, relationshipCount;
            """

            find_the_nodes_query = f"""
                MATCH (source:Career {{Career_ID: '{career_id}'}}) 
                CALL gds.bfs.stream('mainGraph', {{
                    sourceNode: source
                }})
                YIELD path
                WITH nodes(path) AS allNodes
                WITH apoc.coll.flatten(COLLECT([node in allNodes | id(node)])) AS ListEntityTo_{career_id}
                WITH apoc.coll.sort(ListEntityTo_{career_id}) AS sortedListEntityTo_{career_id}

                MATCH (startNode)
                WHERE ID(startNode) IN sortedListEntityTo_{career_id}

                // Build the subgraph using apoc.path.subgraphNodes
                CALL apoc.path.subgraphNodes(
                    startNode,
                    {{ relationshipFilter: '>', minLevel: 0, maxLevel: 1, labelFilter: '+*' }}
                )
                YIELD node

                SET node:VIS_{career_id}
                RETURN node;
            """

            build_subgraph_query = f"""
                CALL gds.graph.exists('SubGraph_{career_id}')
                YIELD exists
                WITH exists
                CALL apoc.do.when(
                    exists,
                    'CALL gds.graph.drop("SubGraph_{career_id}") YIELD graphName RETURN graphName',
                    'RETURN null AS graphName'
                ) YIELD value
                WITH value.graphName AS droppedSubGraphName

                CALL gds.graph.project(
                    'SubGraph_{career_id}',
                    'VIS_{career_id}',
                    '*',
                    {{
                        relationshipProperties: 'weight'
                    }}
                ) YIELD graphName, nodeCount, relationshipCount

                RETURN graphName, nodeCount, relationshipCount;
            """

            run_pagerank_algorithm_query = f"""
                CALL gds.pageRank.stream('SubGraph_{career_id}', {{
                    maxIterations: 20,
                    dampingFactor: 0.85,
                    relationshipWeightProperty: 'weight'
                }})
                YIELD nodeId, score 
                RETURN distinct gds.util.asNode(nodeId).Course_Name AS Course_Name, score
                ORDER BY score DESC, Course_Name ASC
            """

            driver = current_app.neo4j_driver
            with driver.session() as session:
                session.run(remove_vis_node_query)
                session.run(create_main_graph_query)
                session.run(find_the_nodes_query)
                session.run(build_subgraph_query)
                
                result = session.run(run_pagerank_algorithm_query)
                records = [dict(record) for record in result]

                records_json = json.dumps(records, ensure_ascii=False, indent=4)
                return Response(records_json, content_type="application/json", status=200)

    @api.route('/soft_skill')
    class GetSoft_Skill(Resource):
        def get(self):
            # Access neo4j_driver within the request context
            driver = current_app.neo4j_driver
            with driver.session() as session:
                result = session.run("MATCH(n:Soft_Skill) RETURN n")
                records = [record['n'] for record in result]  # Extract Node objects from the result
                data = [dict(node) for node in records]  # Convert Node objects to dictionaries
                json_data = json.dumps(data, ensure_ascii=False, indent=4)  # Serialize to JSON
                return Response(json_data, content_type="application/json; charset=utf-8")

    @api.route('/knowledge')
    class GetKnowledge(Resource):
        def get(self):
            # Access neo4j_driver within the request context
            driver = current_app.neo4j_driver
            with driver.session() as session:
                result = session.run("MATCH(n:Knowledge) RETURN n")
                records = [record['n'] for record in result]  # Extract Node objects from the result
                data = [dict(node) for node in records]  # Convert Node objects to dictionaries
                json_data = json.dumps(data, ensure_ascii=False, indent=4)  # Serialize to JSON
                return Response(json_data, content_type="application/json; charset=utf-8")

    @api.route('/tool')
    class GetTool(Resource):
        def get(self):
            # Access neo4j_driver within the request context
            driver = current_app.neo4j_driver
            with driver.session() as session:
                result = session.run("MATCH(n:Tool) RETURN n")
                records = [record['n'] for record in result]  # Extract Node objects from the result
                data = [dict(node) for node in records]  # Convert Node objects to dictionaries
                json_data = json.dumps(data, ensure_ascii=False, indent=4)  # Serialize to JSON
                return Response(json_data, content_type="application/json; charset=utf-8")

    @api.route('/language')
    class GetLanguage(Resource):
        def get(self):
            # Access neo4j_driver within the request context
            driver = current_app.neo4j_driver
            with driver.session() as session:
                result = session.run("MATCH(n:Language) RETURN n")
                records = [record['n'] for record in result]  # Extract Node objects from the result
                data = [dict(node) for node in records]  # Convert Node objects to dictionaries
                json_data = json.dumps(data, ensure_ascii=False, indent=4)  # Serialize to JSON
                return Response(json_data, content_type="application/json; charset=utf-8")

    @api.route('/course')
    class GetCourse(Resource):
        def get(self):
            # Access neo4j_driver within the request context
            driver = current_app.neo4j_driver
            with driver.session() as session:
                result = session.run("MATCH(n:Course) RETURN n")
                records = [record['n'] for record in result]  # Extract Node objects from the result
                data = [dict(node) for node in records]  # Convert Node objects to dictionaries
                json_data = json.dumps(data, ensure_ascii=False, indent=4)  # Serialize to JSON
                return Response(json_data, content_type="application/json; charset=utf-8")
    
    @api.route('/get_course_by_id/<skill_id>')
    class GetCourseById(Resource):
        def get(self, skill_id):
            skill_type = request.args.get('skillType').replace(" ", "_")

            print(skill_id, skill_type)

            driver = current_app.neo4j_driver
            with driver.session() as session:
                query = f"""
                    MATCH (n:{skill_type} {{{skill_type}_ID: $skill_id}})
                    OPTIONAL MATCH (n) - [:TAUGHT_BY_COURSE] -> (c:Course)
                    RETURN c AS course
                """

                result = session.run(query, skill_id=skill_id)
                record = result.single()

            if record:
                course = record['course']
                print(course)
            if course:
                course_dict = dict(course.items())
            else:
                course_dict = None
            
            return course_dict, 200

    @api.route('/get_prerequisite_skill/<course_id>')
    class GetPrerequisiteSkill(Resource):
        def get(self, course_id):
            driver = current_app.neo4j_driver
            with driver.session() as session:
                query = """
                    MATCH (c:Course {Course_ID: $course_id})
                    OPTIONAL MATCH (c) - [:REQUIRE_TOOL] -> (t:Tool)
                    OPTIONAL MATCH (c) - [:REQUIRE_SOFT_SKILL] -> (s:Soft_Skill)
                    OPTIONAL MATCH (c) - [:REQUIRE_KNOWLEDGE] -> (k:Knowledge)
                    OPTIONAL MATCH (c) - [:REQUIRE_LANGUAGE] -> (l:Language)
                    RETURN COLLECT (DISTINCT t.Tool_Name) AS tools,
                        COLLECT (DISTINCT s.Soft_Skill_Name) AS soft_skills,
                        COLLECT (DISTINCT k.Knowledge_Name) AS knowledges,
                        COLLECT (DISTINCT l.Language_Name) AS languages 
                """

                result = session.run(query, course_id=course_id)
                record = result.single()

            if record:
                tools = record['tools']
                soft_skills = record['soft_skills']
                knowledges = record['knowledges']
                languages = record['languages']

                return ({
                    "tools": tools,
                    "soft_skills": soft_skills,
                    "knowledges": knowledges,
                    "languages": languages
                }), 200
            else:
                return ({"message": "Không tìm thấy thông tin cho khóa học này"}), 404

    @api.route('/get_teach_skill/<course_id>')
    class GetTeachSkill(Resource):
        def get(self, course_id):
            driver = current_app.neo4j_driver
            with driver.session() as session:
                query = """
                    MATCH (c:Course {Course_ID: $course_id})
                    OPTIONAL MATCH (t:Tool) - [:TAUGHT_BY_COURSE] -> (c)
                    OPTIONAL MATCH (s:Soft_Skill) - [:TAUGHT_BY_COURSE] -> (c)
                    OPTIONAL MATCH (k:Knowledge) - [:TAUGHT_BY_COURSE] -> (c)
                    OPTIONAL MATCH (l:Language) - [:TAUGHT_BY_COURSE] -> (c)
                    RETURN COLLECT (DISTINCT t.Tool_Name) AS tools,
                        COLLECT (DISTINCT s.Soft_Skill_Name) AS soft_skills,
                        COLLECT (DISTINCT k.Knowledge_Name) AS knowledges,
                        COLLECT (DISTINCT l.Language_Name) AS languages
                """

                result = session.run(query, course_id=course_id)
                record = result.single()

            if record:
                tools = record['tools']
                soft_skills = record['soft_skills']
                knowledges = record['knowledges']
                languages = record['languages']

                return ({
                    "tools": tools,
                    "soft_skills": soft_skills,
                    "knowledges": knowledges,
                    "languages": languages
                }), 200
            else:
                return ({"message": "Không tìm thấy thông tin cho khóa học này"}), 404

    @api.route('/get_all_learner')
    class GetAllLearner(Resource):
        def get(self):
            # Access neo4j_driver within the request context
            driver = current_app.neo4j_driver
            with driver.session() as session:
                result = session.run("MATCH(n:Learner) RETURN n")
                records = [record['n'] for record in result]  # Extract Node objects from the result
                data = [dict(node) for node in records]  # Convert Node objects to dictionaries
                json_data = json.dumps(data, ensure_ascii=False, indent=4)  # Serialize to JSON
                return Response(json_data, content_type="application/json; charset=utf-8")

    @api.route('/learner/<id>')
    class GetLearner(Resource):
        def get(self, id):
            driver = current_app.neo4j_driver
            with driver.session() as session:
                result = session.run(f"MATCH (n:Learner) WHERE n.Learner_ID = '{id}' RETURN n")
                records = [record['n'] for record in result]
                data = [dict(node) for node in records]
                json_data = json.dumps(data, ensure_ascii=False, indent=4)
                return Response(json_data, content_type="application/json ; charset=uft-8")


    @api.route('/login')
    class Login(Resource):
        @api.expect(account_model)
        def post(self):
            # Lấy dữ liệu từ yêu cầu
            data = request.json
            email = data.get('email')
            password = data.get('password')
        
            # Kiểm tra thông tin đầu vào
            if not email:
                return "Vui lòng nhập email", 400
            if not password:
                return "Vui lòng nhập mật khẩu", 400

            # Truy vấn cơ sở dữ liệu Neo4j để xác minh thông tin người dùng
            driver = current_app.neo4j_driver
            with driver.session() as session:
                query = """
                MATCH (n:Learner )
                WHERE n.Email = $email and n.Password = $password
                RETURN n
                """
                result = session.run(query, email=email, password=password)
                record = result.single()
        
            # Xử lý kết quả truy vấn
            if record:
                learner_node = record['n']
                learner_data = dict(learner_node)
                return learner_data, 200
            else:
                return "Email hoặc mật khẩu không đúng", 401


    @api.route('/register')
    class Register(Resource):
        @api.expect(register_model)
        def post(self):
            # Lấy dữ liệu từ yêu cầu
            data = request.get_json()
            formData = data['formData']
            email = formData.get('email')
            password = formData.get('password')
            name = formData.get('name')
            phone_number = formData.get('phone_number')
            address = formData.get('address')
            age = formData.get('age')
        
        # Kiểm tra thông tin đầu vào
            if not email or not password or not name or not phone_number or not address or age is None:
                return {"message": "Tất cả các trường là bắt buộc"}, 400

        # Thêm người dùng vào cơ sở dữ liệu Neo4j
            driver = current_app.neo4j_driver
            with driver.session() as session:
                # Truy vấn để lấy ID cuối cùng
                query_last_id = """
                MATCH (n:Learner)
                RETURN n.Learner_ID AS id
                ORDER BY id DESC
                LIMIT 1
                """
                result = session.run(query_last_id)
                record = result.single()    

                if record:
                    last_id = record['id']
                    # Tách phần số từ ID
                    last_id_number = int(last_id.split('_')[1])
                    new_id = f'LN_{last_id_number + 1}'
                else:
                    # Nếu không có ID, bắt đầu từ ln_1
                    new_id = 'LN_1'
                
                # Tạo người dùng mới với ID mới
                query_create_user = """
                CREATE (n:Learner {
                    Learner_ID: $id,
                    Email: $email,
                    Password: $password,
                    Name: $name,
                    Phone: $phone_number,
                    Address: $address,
                    Age: $age
                })
                RETURN n
                """
                result = session.run(query_create_user, id=new_id, email=email, password=password, name=name, phone_number=phone_number, address=address, age=age)
                record = result.single()
    
            # Xử lý kết quả truy vấn
            if record:
                learner_node = record['n']
                learner_data = dict(learner_node)
                return {"message": "Đăng ký thành công", "learner": learner_data}, 201
            else:
                return {"message": "Đăng ký thất bại"}, 500

    @api.route('/learner/<learner_id>/known')
    class KnownItems(Resource):
        def get(self, learner_id):
            driver = current_app.neo4j_driver
            with driver.session() as session:
                query = """
                MATCH (l:Learner {Learner_ID: $learner_id})
                OPTIONAL MATCH (l)-[r:HAS_KNOW]->(t:Tool)
                WHERE r.weight = 0
                OPTIONAL MATCH (l)-[r1:HAS_KNOW]->(s:Soft_Skill)
                WHERE r1.weight = 0
                OPTIONAL MATCH (l)-[r2:HAS_KNOW]->(k:Knowledge)
                WHERE r2.weight = 0
                OPTIONAL MATCH (l)-[r3:HAS_KNOW]->(lg:Language)
                WHERE r3.weight = 0
                RETURN COLLECT(DISTINCT t.Tool_Name) AS tools,
                    COLLECT(DISTINCT s.Soft_Skill_Name) AS soft_skills,
                    COLLECT(DISTINCT k.Knowledge_Name) AS knowledges,
                    COLLECT(DISTINCT lg.Language_Name) AS languages
                """

                result = session.run(query, learner_id=learner_id)
                record = result.single()
        
            if record:
                tools = record['tools']
                soft_skills = record['soft_skills']
                knowledges = record['knowledges']
                languages = record['languages']
                total_known_items = len(tools) + len(soft_skills) + len(knowledges) + len(languages)
            
                return ({
                    "tools": tools,
                    "soft_skills": soft_skills,
                    "knowledges": knowledges,
                    "languages": languages,
                    "total_known_items": total_known_items
                }), 200
            else:
                return ({"message": "Không tìm thấy thông tin cho người dùng này"}), 404
    
    @api.route('/learner/<learner_id>/update_info')
    class UpdateInfo(Resource):
        def put(self, learner_id):
            data = request.json

            formData = data.get('formData', {})

            driver = current_app.neo4j_driver
            with driver.session() as session:
                session.run("""
                    MATCH(l:Learner {Learner_ID: $learner_id})
                    SET l.Name = $name, l.Age = $age, l.Email = $email, l.Address = $address, l.Phone = $phone
                    RETURN l
                """, learner_id=learner_id, name=formData.get('Name'), age=formData.get('Age'), email=formData.get('Email'), address=formData.get('Address'), phone=formData.get('Phone'))

            return 'Cập nhật thông tin thành công', 200

    @api.route('/learner/<learner_id>/update_learning_object')
    class UpdateItems(Resource):
        @api.expect(items_model)
        def put(self, learner_id):
            # Lấy dữ liệu từ yêu cầu
            data_json = request.get_json()
            data = data_json.get('data', {})

            print(data)
            selected_tools = data.get('tools', [])
            selected_soft_skills = data.get('soft_skills', [])
            selected_knowledges = data.get('knowledges', [])
            selected_languages = data.get('languages', [])
            
            # Thực hiện cập nhật trong cơ sở dữ liệu Neo4j
            driver = current_app.neo4j_driver
            with driver.session() as session:
                session.run("""
                    MATCH (l:Learner {Learner_ID: $learner_id})-[r:HAS_KNOW]->()
                    DELETE r
                """, learner_id=learner_id)

                # Thêm lại các mối quan hệ "HAS_KNOW" cho các công cụ, kỹ năng mềm, kiến thức và ngôn ngữ đã chọn
                for tool in selected_tools:
                    tool_name = tool['Tool_Name']
                    session.run("""
                    MATCH (l:Learner {Learner_ID: $learner_id}), (t:Tool {Tool_Name: $tool_name})
                    MERGE (l) - [:HAS_KNOW {weight: 0}] -> (t)
                    """, learner_id=learner_id, tool_name=tool_name)

                session.run("""
                MATCH (l:Learner)
                MATCH (t:Tool)
                WHERE NOT (l)-[:HAS_KNOW]->(t)
                MERGE (l)-[rel:HAS_KNOW]->(t)
                SET rel.weight = 1
                """)

                for soft_skill in selected_soft_skills:
                    print(soft_skill['Soft_Skill_Name'])
                    soft_skill_name = soft_skill['Soft_Skill_Name']
                    session.run("""
                    MATCH (l:Learner {Learner_ID: $learner_id}), (s:Soft_Skill {Soft_Skill_Name: $soft_skill_name})
                    MERGE (l) - [:HAS_KNOW {weight: 0}] -> (s)
                    """, learner_id=learner_id, soft_skill_name=soft_skill_name)
                
                session.run("""
                MATCH (l:Learner)
                MATCH (s:Soft_Skill)
                WHERE NOT (l)-[:HAS_KNOW]->(s)
                MERGE (l)-[rel:HAS_KNOW]->(s)
                SET rel.weight = 1
                """)

                for knowledge in selected_knowledges:
                    knowledge_name = knowledge['Knowledge_Name']
                    session.run("""
                    MATCH (l:Learner {Learner_ID: $learner_id}), (k:Knowledge {Knowledge_Name: $knowledge_name})
                    MERGE (l) - [:HAS_KNOW {weight: 0}] -> (k)
                    """, learner_id=learner_id, knowledge_name=knowledge_name)

                session.run("""
                MATCH (l:Learner)
                MATCH (k:Knowledge)
                WHERE NOT (l)-[:HAS_KNOW]->(k)
                MERGE (l)-[rel:HAS_KNOW]->(k)
                SET rel.weight = 1
                """)

                for language in selected_languages:
                    language_name = language['Language_Name']
                    session.run("""
                    MATCH (l:Learner {Learner_ID: $learner_id}), (lg:Language {Language_Name: $language_name})
                    MERGE (l) - [:HAS_KNOW {weight: 0}] -> (lg)
                    """, learner_id=learner_id, language_name=language_name)

                session.run("""
                MATCH (l:Learner)
                MATCH (lg:Language)
                WHERE NOT (l)-[:HAS_KNOW]->(lg)
                MERGE (l)-[rel:HAS_KNOW]->(lg)
                SET rel.weight = 1
                """)
            
            return ({"message": "Thông tin đã được cập nhật thành công"}), 200

    


    


            

