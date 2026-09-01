from sqlalchemy.orm import Session
from app.database import engine, Base
from app.models.location import Location

def seed_data():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    with Session(engine) as db:
        # Check if state exists
        tn = db.query(Location).filter(Location.name == "Tamil Nadu").first()
        if not tn:
            tn = Location(name="Tamil Nadu", type="state")
            db.add(tn)
            db.commit()
            db.refresh(tn)

        # 38 Districts of Tamil Nadu and their major areas
        district_areas = {
            "Ariyalur": ["Ariyalur", "Jayankondam", "Andimadam", "Sendurai", "Udayarpalayam", "T.Palur", "Tirumanur", "Varadarajanpettai", "Meensurutti"],
            "Chengalpattu": ["Chengalpattu", "Tambaram", "Pallavaram", "Guduvanchery", "Maraimalai Nagar", "Singaperumal Koil", "Kelambakkam", "Vandalur", "Madurantakam", "Mahabalipuram"],
            "Chennai": ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "Guindy", "Mylapore", "Nungambakkam", "Egmore", "Saidapet", "Tambaram", "Perambur", "Ambattur", "Porur", "Royapettah", "Triplicane", "Kodambakkam", "Sholinganallur"],
            "Coimbatore": ["Coimbatore", "Pollachi", "Mettupalayam", "Sulur", "Valparai", "Annur", "Kinathukadavu", "Perur", "Karamadai"],
            "Cuddalore": ["Cuddalore", "Chidambaram", "Panruti", "Virudhachalam", "Neyveli", "Tittakudi", "Bhuvanagiri", "Parangipettai", "Kattumannarkoil"],
            "Dharmapuri": ["Dharmapuri", "Harur", "Pennagaram", "Palacode", "Pappireddipatti", "Karimangalam"],
            "Dindigul": ["Dindigul", "Palani", "Kodaikanal", "Oddanchatram", "Vedasandur", "Nilakottai", "Natham", "Batlagundu"],
            "Erode": ["Erode", "Bhavani", "Gobichettipalayam", "Sathyamangalam", "Perundurai", "Anthiyur", "Chennimalai", "Kodumudi", "Modakurichi"],
            "Kallakurichi": ["Kallakurichi", "Chinnasalem", "Sankarapuram", "Ulundurpet", "Tirukkoilur", "Kalvarayan Hills"],
            "Kanchipuram": ["Kancheepuram", "Sriperumbudur", "Kundrathur", "Walajabad", "Uthiramerur", "Sunguvarchatram"],
            "Kanyakumari": ["Nagercoil", "Kanyakumari", "Kuzhithurai", "Marthandam", "Colachel", "Thuckalay", "Suchindram", "Eraniel"],
            "Karur": ["Karur", "Kulithalai", "Aravakurichi", "Krishnarayapuram", "Pugalur", "Velayuthampalayam"],
            "Krishnagiri": ["Krishnagiri", "Hosur", "Denkanikottai", "Uthangarai", "Pochampalli", "Bargur", "Kelamangalam"],
            "Madurai": ["Madurai", "Melur", "Tirumangalam", "Usilampatti", "Vadipatti", "Peraiyur", "Thirupparankundram"],
            "Mayiladuthurai": ["Mayiladuthurai", "Sirkazhi", "Poompuhar", "Kuthalam", "Kollidam", "Vaitheeswarankoil"],
            "Nagapattinam": ["Nagapattinam", "Vedaranyam", "Kilvelur", "Tharangambadi", "Velankanni", "Thirukkuvalai"],
            "Namakkal": ["Namakkal", "Tiruchengode", "Rasipuram", "Paramathi-Velur", "Komarapalayam", "Sendamangalam", "Kolli Hills"],
            "Perambalur": ["Perambalur", "Kunnam", "Veppanthattai", "Alathur", "Labbaikudikadu"],
            "Pudukkottai": ["Pudukkottai", "Aranthangi", "Alangudi", "Keeranur", "Iluppur", "Gandarvakottai", "Avudaiyarkoil"],
            "Ramanathapuram": ["Ramanathapuram", "Rameswaram", "Paramakudi", "Mandapam", "Keelakarai", "Kamuthi", "Mudukulathur", "Sayalkudi"],
            "Ranipet": ["Ranipet", "Arcot", "Walajapet", "Arakkonam", "Sholinghur", "Melvisharam"],
            "Salem": ["Salem", "Mettur", "Attur", "Edappadi", "Sankari", "Omalur", "Vazhapadi", "Yercaud", "Gangavalli"],
            "Sivaganga": ["Sivaganga", "Karaikudi", "Devakottai", "Manamadurai", "Ilayangudi", "Tirupattur", "Kalayarkoil"],
            "Tenkasi": ["Tenkasi", "Sankarankovil", "Kadayanallur", "Shenkottai", "Surandai", "Alangulam", "Vasudevanallur"],
            "Thanjavur": ["Thanjavur", "Kumbakonam", "Pattukkottai", "Papanasam", "Peravurani", "Orathanadu", "Thiruvaiyaru", "Budalur"],
            "Theni": ["Theni", "Periyakulam", "Bodinayakanur", "Cumbum", "Uthamapalayam", "Andipatti", "Chinnamanur"],
            "Thoothukudi": ["Thoothukudi", "Kovilpatti", "Tiruchendur", "Srivaikuntam", "Vilathikulam", "Ettayapuram", "Kayalpattinam", "Arumuganeri"],
            "Tiruchirappalli": ["Tiruchirappalli", "Srirangam", "Manapparai", "Musiri", "Thuraiyur", "Lalgudi", "Thottiyam", "Manachanallur"],
            "Tirunelveli": ["Tirunelveli", "Palayamkottai", "Ambasamudram", "Tenkasi", "Sankarankovil", "Nanguneri", "Valliyur", "Kalakkad", "Cheranmahadevi"],
            "Tirupathur": ["Tirupathur", "Vaniyambadi", "Ambur", "Natrampalli", "Alangayam"],
            "Tiruppur": ["Tiruppur", "Udumalpet", "Dharapuram", "Kangeyam", "Palladam", "Avinashi", "Mulanur", "Kundadam"],
            "Tiruvallur": ["Tiruvallur", "Avadi", "Ponneri", "Tiruttani", "Gummidipoondi", "Ambattur", "Poonamallee", "Uthukkottai", "Red Hills"],
            "Tiruvannamalai": ["Tiruvannamalai", "Arani", "Polur", "Cheyyar", "Vandavasi", "Chengam", "Kalasapakkam", "Chetpet"],
            "Tiruvarur": ["Tiruvarur", "Mannargudi", "Nannilam", "Thiruuthuraipoondi", "Needamangalam", "Kodavasal", "Muthupet"],
            "Vellore": ["Vellore", "Katpadi", "Gudiyatham", "Pernambut", "Kaniyambadi", "Anaicut", "Vellore city"],
            "Viluppuram": ["Viluppuram", "Tindivanam", "Gingee", "Kallakurichi", "Tirukkoilur", "Marakkanam", "Vikravandi", "Ulundurpet"],
            "Virudhunagar": ["Virudhunagar", "Sivakasi", "Rajapalayam", "Aruppukkottai", "Srivilliputhur", "Sattur", "Kariapatti", "Vembakottai"],
            "Nilgiris": ["Ooty (Udhagamandalam)", "Coonoor", "Gudalur", "Kotagiri", "Wellington", "Lovedale", "Avalanche", "Pykara"]
        }

        # Seed the areas
        for district, areas in district_areas.items():
            if district in city_map:
                dist_id = city_map[district].id
                for area_name in areas:
                    area = db.query(Location).filter(Location.name == area_name, Location.parent_id == dist_id).first()
                    if not area:
                        area = Location(name=area_name, type="area", parent_id=dist_id)
                        db.add(area)
                db.commit()

        print("Database successfully seeded with 38 districts of Tamil Nadu and major areas!")

if __name__ == "__main__":
    seed_data()
