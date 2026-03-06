import SwiftUI
import SwiftData
import MapKit

struct RestaurantMapView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var cameraPosition: MapCameraPosition = .userLocation(fallback: .automatic)
    @State private var searchResults: [MKMapItem] = []
    @State private var searchText = ""
    @State private var selectedRestaurant: MKMapItem?
    @State private var showDetail = false
    @State private var isSearching = false
    @State private var errorMessage: String?
    @State private var locationManager = CLLocationManager()
    @State private var userLocation: CLLocationCoordinate2D?

    var body: some View {
        NavigationStack {
            ZStack {
                Color.brandDark.ignoresSafeArea()

                VStack(spacing: 0) {
                    searchBar
                    mapView
                }
            }
            .navigationTitle("Nearby Restaurants")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
            .sheet(isPresented: $showDetail) {
                if let restaurant = selectedRestaurant {
                    restaurantDetailSheet(restaurant)
                }
            }
            .onAppear {
                locationManager.requestWhenInUseAuthorization()
                searchNearbyRestaurants()
            }
        }
    }

    // MARK: - Search Bar

    private var searchBar: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.gray)

            TextField("Search restaurants...", text: $searchText)
                .foregroundColor(.white)
                .autocorrectionDisabled()
                .onSubmit {
                    searchNearbyRestaurants()
                }

            if !searchText.isEmpty {
                Button {
                    searchText = ""
                    searchNearbyRestaurants()
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.gray)
                }
                .frame(minWidth: Layout.minTouchTarget, minHeight: Layout.minTouchTarget)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(Color.brandCard)
    }

    // MARK: - Map

    private var mapView: some View {
        ZStack(alignment: .bottom) {
            Map(position: $cameraPosition) {
                UserAnnotation()

                ForEach(searchResults, id: \.self) { item in
                    Annotation(
                        item.name ?? "Restaurant",
                        coordinate: item.placemark.coordinate
                    ) {
                        Button {
                            selectedRestaurant = item
                            showDetail = true
                        } label: {
                            Image(systemName: "fork.knife.circle.fill")
                                .font(.title2)
                                .foregroundColor(.brandGreen)
                                .background(Circle().fill(Color.brandDark).frame(width: 32, height: 32))
                        }
                    }
                }
            }
            .mapControls {
                MapUserLocationButton()
                MapCompass()
            }

            // Bottom list
            if !searchResults.isEmpty {
                restaurantList
            }

            if let error = errorMessage {
                errorBanner(error)
            }
        }
    }

    // MARK: - Restaurant List

    private var restaurantList: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(searchResults, id: \.self) { item in
                    restaurantCard(item)
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 12)
        }
        .background(Color.brandDark.opacity(0.9))
    }

    private func restaurantCard(_ item: MKMapItem) -> some View {
        Button {
            selectedRestaurant = item
            showDetail = true
        } label: {
            VStack(alignment: .leading, spacing: 6) {
                Text(item.name ?? "Restaurant")
                    .font(.subheadline.bold())
                    .foregroundColor(.white)
                    .lineLimit(1)

                if let address = item.placemark.title {
                    Text(address)
                        .font(.caption)
                        .foregroundColor(.gray)
                        .lineLimit(1)
                }

                if let location = item.placemark.location,
                   let userLoc = userLocation {
                    let distance = location.distance(from: CLLocation(latitude: userLoc.latitude, longitude: userLoc.longitude))
                    let miles = distance / 1609.34
                    Text(String(format: "%.1f mi", miles))
                        .font(.caption2)
                        .foregroundColor(.brandGreen)
                }
            }
            .padding(12)
            .frame(width: 200, alignment: .leading)
            .background(Color.brandCard)
            .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
        }
    }

    // MARK: - Detail Sheet

    private func restaurantDetailSheet(_ restaurant: MKMapItem) -> some View {
        NavigationStack {
            ZStack {
                Color.brandDark.ignoresSafeArea()

                VStack(spacing: Layout.sectionSpacing) {
                    // Restaurant Info
                    VStack(spacing: 8) {
                        Image(systemName: "fork.knife")
                            .font(.system(size: 40))
                            .foregroundColor(.brandGreen)

                        Text(restaurant.name ?? "Restaurant")
                            .font(.title2.bold())
                            .foregroundColor(.white)

                        if let address = restaurant.placemark.title {
                            Text(address)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                                .multilineTextAlignment(.center)
                        }

                        if let phone = restaurant.phoneNumber {
                            Label(phone, systemImage: "phone")
                                .font(.caption)
                                .foregroundColor(.brandGreen)
                        }

                        if let location = restaurant.placemark.location,
                           let userLoc = userLocation {
                            let distance = location.distance(from: CLLocation(latitude: userLoc.latitude, longitude: userLoc.longitude))
                            let miles = distance / 1609.34
                            Label(String(format: "%.1f miles away", miles), systemImage: "location")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding()

                    // Actions
                    VStack(spacing: 12) {
                        NavigationLink {
                            MenuScanView()
                        } label: {
                            HStack {
                                Image(systemName: "doc.text.viewfinder")
                                Text("Scan Their Menu")
                                    .font(.headline)
                            }
                            .foregroundColor(.brandDark)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.brandGreen)
                            .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                        }
                        .frame(minHeight: Layout.minTouchTarget)

                        if let url = restaurant.url {
                            Link(destination: url) {
                                HStack {
                                    Image(systemName: "globe")
                                    Text("Visit Website")
                                        .font(.headline)
                                }
                                .foregroundColor(.brandGreen)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.brandCard)
                                .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                            }
                            .frame(minHeight: Layout.minTouchTarget)
                        }

                        Button {
                            openInMaps(restaurant)
                        } label: {
                            HStack {
                                Image(systemName: "map")
                                Text("Get Directions")
                                    .font(.headline)
                            }
                            .foregroundColor(.brandGreen)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.brandCard)
                            .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                        }
                        .frame(minHeight: Layout.minTouchTarget)
                    }
                    .padding(.horizontal)

                    Spacer()
                }
            }
            .navigationTitle("Restaurant")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { showDetail = false }
                }
            }
        }
    }

    // MARK: - Error

    private func errorBanner(_ message: String) -> some View {
        VStack(spacing: 8) {
            Image(systemName: "exclamationmark.triangle")
                .foregroundColor(.brandOrange)
            Text(message)
                .font(.caption)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)

            Button {
                searchNearbyRestaurants()
            } label: {
                Text("Retry")
                    .font(.caption)
                    .foregroundColor(.brandGreen)
            }
            .frame(minHeight: Layout.minTouchTarget)
        }
        .padding()
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
        .padding()
    }

    // MARK: - Helpers

    private func searchNearbyRestaurants() {
        isSearching = true
        errorMessage = nil

        Task {
            do {
                let request = MKLocalSearch.Request()
                request.naturalLanguageQuery = searchText.isEmpty ? "restaurant" : searchText
                request.resultTypes = .pointOfInterest

                let search = MKLocalSearch(request: request)
                let response = try await search.start()

                await MainActor.run {
                    self.searchResults = response.mapItems
                    self.isSearching = false

                    if let first = response.mapItems.first?.placemark.location?.coordinate {
                        self.userLocation = first
                    }
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = "Could not find nearby restaurants"
                    self.isSearching = false
                }
            }
        }
    }

    private func openInMaps(_ item: MKMapItem) {
        item.openInMaps(launchOptions: [
            MKLaunchOptionsDirectionsModeKey: MKLaunchOptionsDirectionsModeDriving
        ])
    }
}
